import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
// import { createCall } from "./app/actions/call";
import { updateCallConfig } from "./lib/service/callService";
import { createCall } from "./app/actions/call";
import { User } from "./mongodb/models/mainModel";
// import { startCall } from "@/lib/service/callService";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    let callId: string = "";
    socket.emit("message", "Hello, client!");
    socket.on("createCall", async (data) => {
      try {
        console.log("got Data>>>", data);
        const result = await createCall(data);
        socket.emit("callStarted", result);
        callId = result;
      } catch (error) {
        console.error("Error updating database:", error);
      }
    });
    socket.on("disconnect", async() => {
      console.log("Client disconnected", callId);
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

        const user = await User.findById(callCollection.user_id);
        const callStartTime = callCollection.createdAt;
        const callEndTime = callCollection.call_end_time;

        function calculateCredits(startTime: string, endTime: string): number {
          // Parse the timestamps into Date objects
          const start = new Date(startTime);
          const end = new Date(endTime);

          // Calculate the difference in milliseconds
          const differenceInMs = end.getTime() - start.getTime();

          // Convert milliseconds to minutes
          const callDurationInMinutes = differenceInMs / (1000 * 60);

          // Calculate credits
          return callDurationInMinutes * 5;
        }

        const creditsToDeduct = calculateCredits(callStartTime, callEndTime);
        user.credits -= creditsToDeduct;
        await user.save();
        
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