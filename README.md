# Real Sync Chat

A **scalable, real-time chat application** built with a robust architecture, ensuring efficient communication across multiple clients. This application leverages **Redis Pub/Sub**, **Aiven Kafka**, and **PostgreSQL** to provide real-time messaging, scalability, and fault tolerance.

---

## Features

- **Real-time Communication**: Enables seamless messaging using **WebSockets**.
- **Scalable Architecture**: Combines **Redis Pub/Sub** for real-time updates and **Aiven Kafka** for message queueing, ensuring efficient distribution even with large-scale usage.
- **Reliable Message Storage**: Utilizes **PostgreSQL** for persistent storage of chat messages, integrated with **Prisma ORM** for database interaction.
- **Message Brokering**: Configured **Kafka** on Aiven for reliable message production and consumption.

---

## Architecture Overview

1. **Redis Pub/Sub**: Facilitates real-time message distribution across connected clients.
2. **Aiven Kafka**:
   - Handles message brokering.
   - Ensures reliable message queueing and processing.
3. **PostgreSQL**: Stores chat messages persistently.
4. **Prisma ORM**: Simplifies and optimizes database operations.
5. **WebSockets**: Powers real-time communication between clients.

---



### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** database
- **Redis** server
- **Aiven Kafka** (configured and accessible)
- **Prisma CLI**



demo= https://drive.google.com/file/d/1LiMLEYaWTyyyjFnSfeESOYKsHqRw2-VR/view?usp=sharing
