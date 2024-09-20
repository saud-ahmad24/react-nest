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
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, password: string, role: string = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({ email, password: hashedPassword, role });
        return user.save();
    }

    async refreshToken(userId: string) {
        const user = await this.userModel.findById(userId); // Fetch user by ID
        if (!user) {
            throw new Error('User not found');
        }
        const payload = { email: user.email, sub: user._id };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

}
