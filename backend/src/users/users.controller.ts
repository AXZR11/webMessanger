import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersEntity } from "./users.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";


@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
    async getAllUsers() {
        return await this.usersService.getAllUsers()
    }

    @Get('requests')
    async getAllRequests(@Query('userId') userId: string) {
        return await this.usersService.getAllRequests(userId)
    }

    @Post('requests')
    async sendFriendRequest(@Body() body: { requesterId: string, receiverId: string }) {
        return await this.usersService.sendFriendRequest(body.requesterId, body.receiverId)
    }

    @Put('requests/:id')
    @UseGuards(JwtAuthGuard)
    async updateFriendRequestStatus(
        @Param('id') id: string,
        @Body() body: { status: string },
        @Request() req
    ) {
        const userId = req.user.id
        return await this.usersService.updateFriendRequestStatus(id, body.status, userId)
    }

    @Get('list')
    async getFriends(@Query('userId') userId: string) {
        return await this.usersService.getFriends(userId);
    }

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string): Promise<UsersEntity> {
        return this.usersService.findUserByUsername(username)
    }

    @Delete('remove/:friendId')
    @UseGuards(JwtAuthGuard)
    async removeFriend(
        @Param('friendId', ParseUUIDPipe) friendId: string,
        @Request() req
    ) {
        const userId = req.user.id
        
        return await this.usersService.removeFriend(userId, friendId)
    }
}