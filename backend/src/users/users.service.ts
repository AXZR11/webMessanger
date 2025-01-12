import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { UsersEntity } from "./users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendshipEntity } from "./friendships.entity";
import * as path from 'path';
import * as fs from 'fs-extra';
import { ChatsEntity } from "src/chats/chats.entity";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(UsersEntity) 
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(FriendshipEntity)
        private readonly friendshipsRepository: Repository<FriendshipEntity>,
        @InjectRepository(ChatsEntity)
        private readonly chatsRepository: Repository<ChatsEntity>
    ){}

    async findByOAuth(oauthId: string, provider: string) {
        return this.usersRepository.findOne({ where: { oauthId, oauthProvider: provider } })
    }

    async createOAuthUser(oauthId: string, provider: string, username: string) {
        const user = this.usersRepository.create({ oauthId, oauthProvider: provider, username })
        return this.usersRepository.save(user)
    }

    async getAllRequests(userId: string) {
        const friendships = await this.friendshipsRepository.find({
            where: [
                { receiverId: userId, status: 'pending' },
                { requesterId: userId, status: 'pending' }
            ],
            relations: ['requester', 'receiver']
        })

        return friendships.map(friendship => {
            return {
                id: friendship.id,
                requesterId: friendship.requesterId,
                receiverId: friendship.receiverId,
                requester: friendship.requester,
                receiver: friendship.receiver,
                status: friendship.status
            }
        })
    }

    async getUserInfo(userId: string) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['avatarUrl', 'description', 'username'],
        });

        if (!user) {
            throw new Error('Пользователь не найден');
        }

        return user
    }

    async sendFriendRequest(requesterId: string, receiverId: string) {
        const existingFriendship = await this.friendshipsRepository.findOne({
            where: [
                { requesterId, receiverId, status: 'accepted' },
                { requesterId: receiverId, receiverId: requesterId, status: 'accepted' }
            ]
        })

        if (existingFriendship) {
            throw new Error('Already friends')
        }

        const newFriendship = this.friendshipsRepository.create({
            requesterId,
            receiverId,
            status: 'pending'
        })

        return await this.friendshipsRepository.save(newFriendship)
    }

    async updateFriendRequestStatus(id: string, status: string, userId: string) {
        const friendship = await this.friendshipsRepository.findOne({
            where: { id },
            relations: ['requester', 'receiver'],
        });
    
        if (!friendship) {
            throw new Error('Friend request not found');
        }

        if (status === 'accepted' && friendship.receiverId !== userId) {
            throw new Error('Only the receiver can accept a friend request')
        }

        if (status === 'rejected' && friendship.requesterId !== userId && friendship.receiverId !== userId) {
            throw new Error('You are not allowed to reject this friend request');
        }
    
        friendship.status = status;
    
        if (friendship.status === 'accepted') {
            const reverseFriendship = await this.friendshipsRepository.findOne({
                where: {
                    requesterId: friendship.receiverId,
                    receiverId: friendship.requesterId,
                }
            });
    
            if (!reverseFriendship) {
                const newReverseFriendship = this.friendshipsRepository.create({
                    requesterId: friendship.receiverId,
                    receiverId: friendship.requesterId,
                    status: 'accepted'
                });
                await this.friendshipsRepository.save(newReverseFriendship);
            }

            const requester = await this.usersRepository.findOne({ where: { id: friendship.requesterId } });
            const receiver = await this.usersRepository.findOne({ where: { id: friendship.receiverId } });

            if (!requester || !receiver) {
                throw new Error('Users not found for chat creation');
            }

            const chat = this.chatsRepository.create({
                isGroup: false,
                participants: [requester, receiver],
            });

            await this.chatsRepository.save(chat);

        } 
        else if (friendship.status === 'rejected') {
            await this.friendshipsRepository.remove(friendship);
        }
    
        return await this.friendshipsRepository.save(friendship);
    }    

    async getFriends(userId: string) {
        const friendships = await this.friendshipsRepository.find({
            where: [
                { requesterId: userId, status: 'accepted' },
                { receiverId: userId, status: 'accepted' }
            ],
            relations: ['requester', 'receiver']
        })
    
        const friends = friendships.map((friendship) =>
            friendship.requesterId === userId ? friendship.receiver : friendship.requester
        )
    
        const uniqueFriends = Array.from(new Map(friends.map(friend => [friend.id, friend])).values())
    
        return uniqueFriends
    }
    

    async removeFriend(userId: string, friendId: string) {
        const friendships = await this.friendshipsRepository.find({
            where: [
                { requesterId: userId, receiverId: friendId, status: 'accepted' },
                { requesterId: friendId, receiverId: userId, status: 'accepted' }
            ]
        })

        if (friendships.length === 0) {
            throw new Error('No friendship found between these users')
        }

        await this.friendshipsRepository.remove(friendships)

        return { message: 'Friend removed successfully' }
    }

    async getAllUsers() {
        return await this.usersRepository.find()
    }

    async findUserByUsername(username: string): Promise<UsersEntity> {
        const user = await this.usersRepository.findOne({
            where: { username }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async editName(userId: string, newUsername: string): Promise<UsersEntity> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
    
        if (!user) {
          throw new Error('User not found');
        }
    
        const existingUser = await this.usersRepository.findOne({ where: { username: newUsername } });
        if (existingUser) {
          throw new Error('Username is already taken');
        }
    
        user.username = newUsername;
    
        return await this.usersRepository.save(user);
      }

    async editDesc(userId: string, newDesc: string): Promise<UsersEntity> {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        })

        if(!user) {
            throw new Error('User not found')
        }

        user.description = newDesc

        return this.usersRepository.save(user)
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        });
    
        if (user.avatarUrl) {
            const oldAvatarFilename = user.avatarUrl.split('/uploads/avatars/')[1];
            const oldAvatarPath = path.resolve(__dirname, '../../uploads/avatars', oldAvatarFilename);
    
            try {
                await fs.remove(oldAvatarPath);
                console.log(`Старый аватар успешно удален: ${oldAvatarPath}`);
            } catch (error) {
                console.error('Ошибка при удалении старого аватара:', error);
            }
        }
    
        user.avatarUrl = avatarUrl;
        await this.usersRepository.save(user);
    }
}