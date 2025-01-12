import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    WebSocketServer,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatsService } from 'src/chats/chats.service';
  import { MessageEntity } from 'src/chats/messages.entity';
  
  @WebSocketGateway(3001, { cors: { origin: '*' } })
  export class ChatGateway implements OnGatewayInit {
    @WebSocketServer() server: Server;
  
    constructor(private readonly messageService: ChatsService) {}
  
    afterInit(server: Server) {
      console.log('WebSocket Server Initialized');
    }
  
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: { chatId: string; senderId: string; content: string },
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        const { chatId, senderId, content } = data;

        if (!chatId || !senderId || !content) {
            console.error('Invalid message data:', data);
            client.emit('sendMessageResponse', { status: 'error', message: 'Invalid message data' });
            return;
        }

        try {
            const savedMessage: MessageEntity = await this.messageService.createMessage(chatId, senderId, content);

            this.server.to(chatId).emit('receiveMessage', savedMessage);

            console.log('Sending response to client: success', savedMessage);

            client.emit('sendMessageResponse', { 
                status: 'success', 
                message: savedMessage
            });

            console.log('Message sent and saved:', savedMessage);
        } catch (error) {
            console.error('Error handling message:', error);
            client.emit('sendMessageResponse', { status: 'error', message: 'Failed to send message' });
        }
    }
  
    @SubscribeMessage('join')
    handleJoinChat(@MessageBody() chatId: string, @ConnectedSocket() socket: Socket): void {
      if (!chatId) {
        console.error('Chat ID is missing');
        return;
      }
  
      try {
        socket.join(chatId);
        console.log(`Client ${socket.id} joined chat room: ${chatId}`);
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', 'Failed to join chat');
      }
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
  
      const rooms = Array.from(client.rooms);
      rooms.forEach((room) => {
        if (room !== client.id) {
          client.leave(room);
          console.log(`Client ${client.id} left room: ${room}`);
        }
      });
    }
  }  