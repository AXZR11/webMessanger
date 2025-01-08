import { Body, Controller, Get, Post, Req, Query, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Response, query } from "express";

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.register(username, email, password)
    }

    @Post('login')
    async login(
        @Body('username') username: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(username, password)
    }

    @Post('oauth')
    async oauthLogin(
        @Body('oauthProvider') oauthProvider: string,
        @Body('accessToken') accessToken: string,
    ) {
        return this.authService.oauthLogin(oauthProvider, accessToken, null)
    }
   
    @Get('vk')
    @UseGuards(AuthGuard('vk'))
    vkLogin() {}

    @Get('vk/callback')
    @UseGuards(AuthGuard('vk'))
    async vkCallback(@Req() req, @Res() res: Response) {
    }

    @Get('yandex')
    @UseGuards(AuthGuard('yandex'))
    yandexLogin() {

    }

    @Get('yandex/redirect')
    @UseGuards(AuthGuard('yandex'))
    async yandexRedirect(@Req() req, @Res() res: Response) {
        console.log('req.user:', req.user); // Логируем данные из req.user

        try {
            const accessToken = req.user?.accessToken;
            const refreshToken = req.user?.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Access token or refresh token is missing');
            }

            console.log('Yandex Redirect - Access Token:', accessToken);
            console.log('Yandex Redirect - Refresh Token:', refreshToken);

            // Вызываем authService для обработки токенов
            const result = await this.authService.oauthLogin('yandex', accessToken, refreshToken);

            console.log('Result from oauthLogin:', result);

            // Редирект с accessToken в качестве параметра
            res.redirect(`http://localhost:8080/login?accessToken=${result.accessToken}&userId=${result.userId}`);
        } catch (error) {
            console.error('Error during OAuth login:', error);
            res.status(500).json({ message: 'Error during OAuth login', error: error.message });
        }
    }
}