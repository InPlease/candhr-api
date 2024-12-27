// Dependencies
import { Module } from '@nestjs/common';

// Controllers
import { AuthController } from '@/controllers/auth/auth.controller';

// Services
import { AuthService } from '@/services/auth/auth.service';
import { TursoService } from '@/services/turso.service';

@Module({
  controllers: [AuthController],
  providers: [TursoService, AuthService],
  imports: [AuthModule],
})
export class AuthModule {}
