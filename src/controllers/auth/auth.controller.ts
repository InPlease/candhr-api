// Dependencies
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

// Models
import { SignUpDataModel, CheckIfUserIsVerify } from '@/models/auth.model';

// Service
import { TursoService } from '@/services/turso.service';
import { AuthService } from '@/services/auth/auth.service';

// Utils
import { CryptoCreatorPipe } from '@/utils/pipes/sign-up/crypto-creator/crypto-creator.pipe';
import { EmailSenderService } from '@/services/email-sender/email-sender.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly turso: TursoService,
    private readonly authService: AuthService,
    private readonly emailSender: EmailSenderService,
  ) {}

  /**
   * Just to let you know the verification codes meanings
   * 1: signup
   * 2: forgot_password
   * 3: login
   */
  @Post('signup')
  @UsePipes(CryptoCreatorPipe)
  async getHello(@Body() signUpData: SignUpDataModel) {
    const roleId = await this.turso.getRole(signUpData.role_id);
    const userExists = await this.turso.checkIfUserExist(signUpData);

    if (userExists) {
      return userExists;
    }

    await this.authService.createUser(signUpData, `${roleId}s`);

    const verificationCode = this.authService.generateNumericCode(
      signUpData.id,
    );
    const verifyCodeIdType =
      roleId === 'candidates' ? 'candidate_id' : 'recruiter_id';

    await this.authService.createVerifyCode(
      verificationCode,
      verifyCodeIdType,
      signUpData.id,
      1,
    );

    await this.emailSender.sendEmail(
      signUpData.email,
      'Account Creation',
      `/auth/verification?uuid=${signUpData.id}`,
      verificationCode,
      `${signUpData.name} ${signUpData.last_name}`,
      signUpData.language,
    );

    return {
      message:
        'User has been created, also we just generated a verification code',
      status: 201,
      verficiationCode: verificationCode,
      userUuid: signUpData.id,
    };
  }

  @Post('verification')
  async verifyAccount(@Body() verificationData: CheckIfUserIsVerify) {
    try {
      await this.authService.deleteAllExpiredVerificationCodes();

      /**
       * We need to control this thing, avoid user to send unnecesary request
       * to backend when code is created.
       */
      if (verificationData.create) {
        const verifiycationCodeAlreadyExist =
          await this.authService.verifyCodeExistByUuidAndType(
            verificationData.column,
            verificationData.type,
            verificationData.uuid,
          );

        if (verifiycationCodeAlreadyExist.rows.length) {
          return {
            status: 409,
            message:
              'The verification code is still valid. Please use the existing code instead of generating a new one',
          };
        }

        const verificationCode = this.authService.generateNumericCode(
          verificationData.uuid,
        );

        await this.authService.createVerifyCode(
          verificationCode,
          verificationData.column,
          verificationData.uuid,
          verificationData.type,
        );

        return {
          status: 201,
          message: 'Verification code was created',
        };
      }

      const existVerificationCode =
        await this.authService.verificationCodeExist(
          verificationData.column,
          verificationData.uuid,
          verificationData.code,
          verificationData.type,
        );

      if (existVerificationCode.rows.length) {
        await this.authService.deleteVerificationCode(
          verificationData.column,
          verificationData.uuid,
          verificationData.code,
        );

        return {
          status: 200,
          message: 'User has been successfully verified',
          user_is_verified: true,
        };
      }

      return {
        status: 401,
        message:
          'Unauthorized: User verification failed. The verification code may have expired or been deleted',
        user_is_verified: false,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
