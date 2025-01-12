import { Body, Controller, Get, Post, Req, Query, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Response, query } from "express";
import axios from "axios";

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
        try {
            const user = req.user;
            console.log('VK User:', user);

            const result = await this.authService.oauthLogin('vk', user.accessToken, null);

            res.redirect(`http://localhost:8080/login?accessToken=${result.accessToken}&userId=${result.userId}`);
        } catch (error) {
            console.error('VK Callback Error:', error.message);
            res.status(500).json({ message: 'Ошибка авторизации через VK', error: error.message });
        }
    }

    @Get('yandex')
    @UseGuards(AuthGuard('yandex'))
    yandexLogin() {

    }

    @Get('vk-config')
    async getVkConfig(@Query('app_id') appId: string, @Res() res: Response) {
        try {
            const response = await axios.get(`https://id.vk.com/vkid_sdk_get_config?app_id=${appId}&v=5.207`);
            res.send(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).send(error.response?.data || 'Error fetching VK config');
        }
    }

    @Get('yandex/redirect')
    @UseGuards(AuthGuard('yandex'))
    async yandexRedirect(@Req() req, @Res() res: Response) {
        console.log('req.user:', req.user);

        try {
            const accessToken = req.user?.accessToken;
            const refreshToken = req.user?.refreshToken;

            if (!accessToken || !refreshToken) {
                throw new Error('Access token or refresh token is missing');
            }

            console.log('Yandex Redirect - Access Token:', accessToken);
            console.log('Yandex Redirect - Refresh Token:', refreshToken);

            const result = await this.authService.oauthLogin('yandex', accessToken, refreshToken);

            console.log('Result from oauthLogin:', result);

            res.redirect(`https://zhirnow.ru.tuna.am/login?accessToken=${result.accessToken}&userId=${result.userId}`);
        } catch (error) {
            console.error('Error during OAuth login:', error);
            res.status(500).json({ message: 'Error during OAuth login', error: error.message });
        }
    }
}