import http from "http";
import socketService from "./services/socket"; 
import { startMessageConsumer } from  "./services/kafka"          
async function init() {
    startMessageConsumer();
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;
    
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () =>
        console.log(`HTTP Server started at PORT:${PORT}`)
    );

    socketService.initListeners();
}

init();
