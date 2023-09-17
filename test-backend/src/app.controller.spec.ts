import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthDto } from './auth/Dto/auth.dto';

describe('AppController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const testData: AuthDto = {
        userName: 'marioobr',
        password: 'test',
      };
      expect(authController.signIn(testData)).toBe(testData);
    });
  });
});
