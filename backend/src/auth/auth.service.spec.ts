import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

const mockUser = {
    _id: '123',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    refreshToken: 'someRefreshToken',
};

const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    updateOne: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                JwtService,
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await authService.validateUser('test@example.com', 'password');

            expect(result).toEqual({ email: mockUser.email, _id: mockUser._id, role: mockUser.role });
        });

        it('should throw an error if credentials are invalid', async () => {
            jest.spyOn(mockUserModel, 'findOne').mockResolvedValue(null);

            await expect(authService.validateUser('test@example.com', 'wrongPassword')).rejects.toThrowError('Invalid credentials');
        });
    });

    describe('login', () => {
        it('should return access and refresh tokens', async () => {
            const result = await authService.login(mockUser);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(mockUserModel.updateOne).toHaveBeenCalledWith({ _id: mockUser._id }, { refreshToken: expect.any(String) });
        });
    });

    describe('register', () => {
        it('should save a new user', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockUser.password);
            jest.spyOn(mockUserModel, 'save').mockResolvedValue(mockUser);

            const result = await authService.register('test@example.com', 'password');
            expect(result).toEqual(mockUser);
        });
    });

    describe('refreshToken', () => {
        it('should return new tokens if refresh token is valid', async () => {
            const decoded = { sub: mockUser._id };
            jest.spyOn(authService['jwtService'], 'verify').mockReturnValue(decoded);
            jest.spyOn(mockUserModel, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(authService['jwtService'], 'sign').mockReturnValue('newAccessToken');

            const result = await authService.refreshToken('validRefreshToken');
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
        });

        it('should throw an error if refresh token is invalid', async () => {
            jest.spyOn(authService['jwtService'], 'verify').mockImplementation(() => { throw new Error(); });

            await expect(authService.refreshToken('invalidRefreshToken')).rejects.toThrowError('Could not refresh token');
        });
    });
});
