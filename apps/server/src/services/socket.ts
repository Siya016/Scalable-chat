
import { Server } from "socket.io";
import Redis from "ioredis";
import prisma from "./prisma"; 
import { produceMessage } from "./kafka";// Correct import statement

// Use the correct password for both Redis clients
const redisPassword = "";

// Create Redis clients with TLS enabled
const pub = new Redis({
    host: "",
    port: 0,
    password: redisPassword,
    tls: {}  // Enable TLS
});

const sub = new Redis({
    host: "",
    port: 0,
    password: redisPassword,
    tls: {}  // Enable TLS
});

class SocketService {
    private _io: Server;  // Declare property

    constructor() {
        console.log("Initializing Socket Service...");

        // Initialize the Socket.IO server with CORS allowed for all origins
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: "*",
            },
        });

        // Subscribe to the "MESSAGES" Redis channel
        sub.subscribe("MESSAGES", (err, count) => {
            if (err) {
                console.error("Failed to subscribe to Redis channel 'MESSAGES':", err);
            } else {
                console.log(`Subscribed to Redis channel 'MESSAGES'. Subscriptions count: ${count}`);
            }
        });

        // Handle Redis errors
        sub.on("error", (err) => {
            console.error("Redis subscription error:", err);
        });

        pub.on("error", (err) => {
            console.error("Redis publish error:", err);
        });
    }

    get io() {
        return this._io;
    }

    public initListeners() {
        const io = this._io;
        console.log("Initializing Socket Listeners...");

        io.on("connect", (socket) => {
            console.log(`Socket connected: ${socket.id}`);

            // Handle incoming message event from frontend
            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log("New Message received:", message);

                try {
                    // Publish the message to the "MESSAGES" Redis channel
                    const result = await pub.publish("MESSAGES", JSON.stringify({ message }));
                    console.log("Publish result:", result);
                } catch (error) {
                    console.error("Error publishing message to Redis:", error);
                }
            });
        });

        // Listen for messages on the Redis channel and emit them via Socket.IO
        sub.on("message", async (channel, message) => {
            if (channel === "MESSAGES") {
                console.log(`Message received from channel '${channel}': ${message}`);

                // Emit the message to all connected clients
                io.emit("message", message);
                await produceMessage(message);
                console.log("Message sent  to Kafka Broker");

                
            }
        });
    }
}

// Initialize Socket Service and export it
const socketService = new SocketService();
export default socketService;
