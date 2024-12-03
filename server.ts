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

        const callStartTime = callCollection.createdAt;
        const callEndTime = callCollection.call_end_time;
        
        const creditsToDeduct = calculateCredits(callStartTime, callEndTime);

        let retryCount = 0;
        let success = false;

        while (retryCount < MAX_RETRIES && !success) {
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const user = await User.findById(callCollection.user_id).session(session);
            if (user) {
              user.credits -= creditsToDeduct;
              await user.save({ session });
            }
            await session.commitTransaction();
            success = true;
          } catch (error) {
            await session.abortTransaction();
            retryCount++;
            console.error(`Transaction failed, retrying (${retryCount}/${MAX_RETRIES})`, error);
          } finally {
            session.endSession();
          }
        }

        if (!success) {
          console.error("Transaction failed after retries.");
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
