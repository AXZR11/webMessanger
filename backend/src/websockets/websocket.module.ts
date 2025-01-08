import { Module } from "@nestjs/common";
import { WebSocketService } from "./websocket.service";
import { WsGateway } from "./websocket.gateway";

@Module({
    providers: [WebSocketService, WsGateway],
    exports: [WebSocketService]
})
export class WsModule{}