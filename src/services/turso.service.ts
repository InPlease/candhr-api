import { Injectable } from '@nestjs/common';

// Turso Config
import { turso } from '@configs/turso';

// Models
import { CheckIfUserExitModel } from '@/models/auth.model';

// Utils
import { getRoleQuery, userExistsQuery } from '@/utils/querys';

@Injectable()
export class TursoService {
  async checkIfUserExist({ email, phone_number }: CheckIfUserExitModel) {
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

  async getRole(id: number): Promise<string> {
    const roleName = (await turso.execute(getRoleQuery(id))).rows[0]
      .name as string;
    return roleName;
  }
}
