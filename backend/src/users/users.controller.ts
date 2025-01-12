import { Body, Req, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors, ConflictException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersEntity } from "./users.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs-extra';
import * as path from 'path';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
    async getAllUsers() {
        return await this.usersService.getAllUsers()
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: any) {
        const userId = req.user.id
        return this.usersService.getUserInfo(userId)
    }

    @Get('requests')
    async getAllRequests(@Query('userId') userId: string) {
        return await this.usersService.getAllRequests(userId)
    }

    @Get(':id/info')
    async getUserInfo(@Param('id') userId: string) {
        return await this.usersService.getUserInfo(userId)
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

    @Patch(':id/username')
    async updateUsername(
        @Param('id') id: string,
        @Body('username') newUsername: string
      ): Promise<UsersEntity> {
        try {
          return await this.usersService.editName(id, newUsername);
        } catch (error) {
          if (error.message === 'User not found') {
            throw new NotFoundException('User not found');
          }
          if (error.message === 'Username is already taken') {
            throw new ConflictException('Username is already taken');
          }
          throw error;
        }
      }

    @Patch(':id/description')
    async updateDesc(
        @Param('id') id: string,
        @Body('description') newDesc: string
    ): Promise<UsersEntity> {
        return await this.usersService.editDesc(id, newDesc)
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

    @Post(':id/upload-avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: path.resolve(__dirname, '../../uploads/avatars'),
                filename: (req, file, callback) => {
                    const filename = `${uuidv4()}${extname(file.originalname)}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    async uploadAvatar(@Param('id') userId: string, @UploadedFile() file: Express.Multer.File) {
        const uploadPath = path.resolve(__dirname, '../../uploads/avatars');
        console.log(`Путь для загрузки файлов: ${uploadPath}`);

        try {
            await fs.ensureDir(uploadPath);
            console.log(`Директория ${uploadPath} успешно создана или уже существует`);

            const avatarUrl = `https://backzhirnow.ru.tuna.am/uploads/avatars/${file.filename}`;
            console.log(`Загружен файл с именем: ${file.filename}`);
            await this.usersService.updateAvatar(userId, avatarUrl);

            return { avatarUrl };
        } catch (error) {
            console.error('Ошибка при создании папки или загрузке файла:', error);
            throw new Error('Не удалось загрузить аватар');
        }
    }
}