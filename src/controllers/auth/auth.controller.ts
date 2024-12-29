// Dependencies
import { Body, Controller, Post, UsePipes } from '@nestjs/common';

// Models
import { SignUpDataModel } from '@/models/auth.model';

// Service
import { TursoService } from '@/services/turso.service';
import { AuthService } from '@/services/auth/auth.service';

// Utils
import { CryptoCreatorPipe } from '@/utils/pipes/sign-up/crypto-creator/crypto-creator.pipe';
import { CurrentDatePipe } from '@/utils/pipes/sign-up/current-date/current-date.pipe';
import { EmailSenderService } from '@/services/email-sender/email-sender.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly turso: TursoService,
    private readonly authService: AuthService,
    private readonly emailSender: EmailSenderService,
  ) {}

  @Post('signup')
  @UsePipes(CryptoCreatorPipe, CurrentDatePipe)
  async getHello(@Body() signUpData: SignUpDataModel) {
    try {
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
    } catch {
      throw new Error('Something went wrong when creatin user.');
    }
  }
}
