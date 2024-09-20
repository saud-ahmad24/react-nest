import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string; role?: string }) {
        const { email, password, role } = body;
        console.log(body)
        return this.authService.register(email, password, role);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        console.log(body)
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user);
    }

    //   @Post('refresh-token')
    //   async refreshToken(@Body() body: { refreshToken: string }) {
    //     // Assuming you have a way to validate the refresh token and extract user info
    //     const userId = this.validateRefreshToken(body.refreshToken);
    //     return this.authService.refreshToken(userId);
    //   }

    //   private validateRefreshToken(token: string): string {
    //     try {
    //       const decoded = this.authService.jwtService.verify(token);
    //       return decoded.sub; // Assuming sub contains userId
    //     } catch (e) {
    //       throw new Error('Invalid refresh token');
    //     }
    //   }
}
