import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { updateCallConfig } from "./lib/service/callService";
import { createCall } from "./app/actions/call";
import { User } from "./mongodb/models/mainModel";
import mongoose from "mongoose";
import { calculateCredits } from "./lib/calculation";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Use 0.0.0.0 for production to allow external connections
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const MAX_RETRIES = 3; // Maximum retries for transaction

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000", // Set this to the deployed client URL
      methods: ["GET", "POST"],
    },
  });

  const deductCredits = async (userId:string, creditsToDeduct:number, session:any) => {
    const result : any = await User.updateOne(
      { _id: userId },
      { $inc: { credits: -creditsToDeduct } },
      { session }
    );
    if (result.nModified === 0) {
      throw new Error("Failed to deduct credits. User not found or no update made.");
    }
  };
  

  const executeTransaction = async (callCollection:any, creditsToDeduct:number) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Deduct credits using atomic operation
      await deductCredits(callCollection.user_id, creditsToDeduct, session);
  
      await session.commitTransaction();
      return true; // Transaction succeeded
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction failed", error);
      return false; // Transaction failed
    } finally {
      session.endSession();
    }
  };
  const delay = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));


  io.on("connection", (socket) => {
    let callId: string = "";
    socket.emit("message", "Hello, client!");

    socket.on("createCall", async (data) => {
      try {
        const result = await createCall(data);
        socket.emit("callStarted", result);
        callId = result;
      } catch (error) {
        console.error("Error updating database:", error);
      }
    });

    socket.on("disconnect", async () => {
      if (callId) {
        const currentTime = new Date();
        const callCollection = await updateCallConfig(
          callId,
          {
            last_activity: currentTime,
            call_end_time: currentTime,
          },
          true
        );
    
        if (!callCollection) {
          console.error("Call collection not found for callId:", callId);
          return;
        }
    
        const callStartTime = callCollection.createdAt;
        const callEndTime = callCollection.call_end_time;
    
        const creditsToDeduct = calculateCredits(callStartTime, callEndTime);
    
        if (creditsToDeduct <= 0) {
          console.log("No credits to deduct for this call.");
          return;
        }
    
        let retryCount = 0;
        let success = false;
    
        while (retryCount < MAX_RETRIES && !success) {
          try {
            success = await executeTransaction(callCollection, creditsToDeduct);
          } catch (error) {
            console.error(
              `Retry ${retryCount + 1} failed for callId: ${callId}, userId: ${callCollection.user_id}:`,
              error
            );
          }
    
          if (!success) {
            retryCount++;
            await delay(1000);
          }
        }
    
        if (!success) {
          console.error(`Transaction failed for callId: ${callId} after ${MAX_RETRIES} retries.`);
        }
      }
    });
    
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
