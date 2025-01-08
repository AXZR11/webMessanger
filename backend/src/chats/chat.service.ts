import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatsEntity } from "./chats.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatsService{
    constructor(@InjectRepository(ChatsEntity) private chatsRepository: Repository<ChatsEntity>){}
}