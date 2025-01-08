import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsersEntity } from "./users.entity";

@Entity('friendships')
export class FriendshipEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    requesterId: string

    @Column()
    receiverId: string

    @Column({ default: 'pending' })
    status: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => UsersEntity, (user) => user.sentFriendRequests)
    requester: UsersEntity

    @ManyToOne(() => UsersEntity, (user) => user.receivedFriendRequests)
    receiver: UsersEntity
}