import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string; role?: string }) {
        const { email, password, role } = body;
        return this.authService.register(email, password, role);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user);
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: { token: any }) {
        const { token } = body;
        console.log("refreshtoken   refresh-token", token);
        if (!token) {
            throw new UnauthorizedException('Refresh token is required');
        }
        return this.authService.refreshToken(token);
    }
}
