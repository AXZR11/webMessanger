import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { VkStrategy } from "./strategies/vk.strategy";
import { YandexStrategy } from "./strategies/yandex.strategy";
import { JwtAuthGuard } from "./jwt-auth-guard";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTczNjEzMzE5OSwiaWF0IjoxNzM2MTMzMTk5fQ.-ofMIrqKrXOOaUYwgNOAHunp_jYICoTn8rWJYbA13xM',
            signOptions: { expiresIn: '1h' }
        }),
        forwardRef(() => UsersModule)
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, VkStrategy, YandexStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule, JwtAuthGuard]
})
export class AuthModule {}