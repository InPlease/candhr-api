import { Injectable } from '@nestjs/common';

// Turso Config
import { turso } from '@configs/turso';

// Utils
import { createUserQuery } from '@/utils/querys';

// Models
import { SignUpDataModel } from '@/models/auth.model';

@Injectable()
export class AuthService {
  async createUser(signUpData: SignUpDataModel, tableName) {
    return await turso.execute({
      sql: createUserQuery(tableName),
      args: [
        signUpData.id,
        signUpData.name,
        signUpData.last_name,
        signUpData.email,
        signUpData.phone_number,
        signUpData.password,
        signUpData.birth_date,
        signUpData.role_id || 1,
        signUpData.accept_terms_conditions,
        signUpData.create_at,
        signUpData.update_at,
      ],
    });
  }
}
