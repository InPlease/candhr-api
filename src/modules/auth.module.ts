// Dependencies
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';
import { TransportOptions } from 'nodemailer';

// Controllers
import { AuthController } from '@/controllers/auth/auth.controller';

// Services
import { AuthService } from '@/services/auth/auth.service';
import { TursoService } from '@/services/turso.service';
import { EmailSenderService } from '@/services/email-sender/email-sender.service';

/* configuration in relation to .env native by nest was not working
   could be due to a wrong configuration, need to take a look
*/
dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [TursoService, AuthService, EmailSenderService],
  imports: [
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      } as TransportOptions,
    }),
  ],
})
export class AuthModule {}
