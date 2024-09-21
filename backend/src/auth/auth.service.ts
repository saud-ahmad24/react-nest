import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.userModel.updateOne({ _id: user._id }, { refreshToken });

        return {
            accessToken,
            refreshToken,
            role: user.role,
            email: user.email
        };
    }

    async register(email: string, password: string, role: string = 'user') {

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            return { message: 'User already exists with this email' };
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new this.userModel({ email, password: hashedPassword, role });
        return user.save();
    }
    

    async refreshToken(oldRefreshToken: string) {
        try {
            const decoded = this.jwtService.verify(oldRefreshToken);

            const user: any = await this.userModel.findById(decoded.sub);
            if (!user || user.refreshToken !== oldRefreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const payload = { email: user.email, sub: user._id, role: user.role };
            const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
            const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

            await this.userModel.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                role: user.role,
                email: user.email
            };
        } catch (error) {
            throw new UnauthorizedException('Could not refresh token');
        }
    }

}
