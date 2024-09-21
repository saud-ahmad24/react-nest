import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService : any = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
};

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('register', () => {
        it('should call authService.register', async () => {
            const registerDto = { email: 'test@example.com', password: 'password' };
            await authController.register(registerDto);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto.email, registerDto.password, undefined);
        });
    });

    describe('login', () => {
        it('should call authService.login', async () => {
            const loginDto = { email: 'test@example.com', password: 'password' };
            await authController.login(loginDto);
            expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
        });
    });

    describe('refreshToken', () => {
        it('should throw UnauthorizedException if no token is provided', async () => {
            await expect(authController.refreshToken({ token: null })).rejects.toThrow(UnauthorizedException);
        });

        it('should call authService.refreshToken with the token', async () => {
            const token = 'validToken';
            await authController.refreshToken({ token });
            expect(mockAuthService.refreshToken).toHaveBeenCalledWith(token);
        });
    });
});
