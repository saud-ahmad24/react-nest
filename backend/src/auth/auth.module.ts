import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller'; // Import the AuthController

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'your-secret-key', // Use an environment variable in production
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController], // Add the AuthController here
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
