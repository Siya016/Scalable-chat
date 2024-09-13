
import { Kafka, Producer } from "kafkajs";
import fs from 'fs';
import path from 'path';
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prismaClient = new PrismaClient();

const caFilePath = 'ca.pem'; 

const kafka = new Kafka({
    brokers: [''],
    ssl: {
        ca: [fs.readFileSync(caFilePath, "utf-8")],
    },
    //sasl: {
        //username: '',
       //password: '',
        //mechanism: '',
    //},
});

let producer: Producer | null = null;

export async function createProducer(): Promise<Producer> {
    if (producer) return producer;

    producer = kafka.producer();
    await producer.connect();
    return producer;
}

export async function produceMessage(message: string): Promise<boolean> {
    const producer = await createProducer();
    await producer.send({
        topic: "MESSAGES",
        messages: [
            { key: `message-${Date.now()}`, value: message }
        ],
    });
    return true;
}

export async function startMessageConsumer() {
    console.log("consumer is running...");
    const consumer = kafka.consumer({ groupId: "default" });

    await consumer.connect();
    await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            if (!message.value) return;

            console.log('New message received:', message.value.toString());

            try {
                // Save the message to the database
                await prismaClient.message.create({
                    data: {
                        text: message.value.toString(),
                    },
                });
            } catch (error) {
                console.error("something is wrong");

                // Pause the consumer and resume after a timeout
                consumer.pause([{ topic: "MESSAGES" }]); // Pauses specific topic
                setTimeout(() => {
                    consumer.resume([{ topic: "MESSAGES" }]); // Resumes specific topic
                }, 60 * 1000); // Pause for 60 seconds
            }
        },
    });
}

// Export kafka as the default
export default kafka;
