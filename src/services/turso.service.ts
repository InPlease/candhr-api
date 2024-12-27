import { Injectable } from '@nestjs/common';

// Turso Config
import { turso } from '@configs/turso';

// Models
import { SignUpDataModel, CheckIfUserExitModel } from '@/models/auth.model';

// Utils
import { getRoleQuery } from '@/utils/querys';

@Injectable()
export class TursoService {
  async checkIfUserExist({ email, phone_number }: CheckIfUserExitModel) {
    const userExistsQuery = `
    SELECT 1 FROM recruiters 
    WHERE email = ? OR phone_number = ?
    LIMIT 1;
    `;

    const result: { rows: Array<any> } = await turso.execute({
      sql: userExistsQuery,
      args: [email, phone_number],
    });

    if (result && result.rows.length) {
      return {
        status: 403,
        message: 'User already exist',
      };
    }

    return false;
  }

  async getRole(id: number) {
    const roleName = await turso.execute(getRoleQuery(id));
    return roleName;
  }
}
