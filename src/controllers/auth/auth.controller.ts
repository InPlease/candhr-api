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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly turso: TursoService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @UsePipes(CryptoCreatorPipe, CurrentDatePipe)
  async getHello(@Body() signUpData: SignUpDataModel) {
    const role_id = await this.turso.getRole(1);

    const userExists = await this.turso.checkIfUserExist(signUpData);

    if (userExists) {
      return userExists;
    }
    console.log(signUpData);

    const createUser = await this.authService.createUser(
      signUpData,
      `${role_id.rows[0].name}s`,
    );

    return {
      message: 'User has been created',
      status: 201,
      user_uuid: signUpData.id,
    };
  }
}
