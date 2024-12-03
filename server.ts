import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { updateCallConfig } from "./lib/service/callService";
import { createCall } from "./app/actions/call";
import { User } from "./mongodb/models/mainModel";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0"; // Use 0.0.0.0 for production to allow external connections
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

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

        const user = await User.findById(callCollection.user_id);
        const callStartTime = callCollection.createdAt;
        const callEndTime = callCollection.call_end_time;

        function calculateCredits(startTime: string, endTime: string): number {
          const start = new Date(startTime);
          const end = new Date(endTime);
          const differenceInMs = end.getTime() - start.getTime();
          const callDurationInMinutes = differenceInMs / (1000 * 60);
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