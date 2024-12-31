// Dependencies
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// Turso Config
import { turso } from '@configs/turso';

// Utils
import {
  createUserQuery,
  createVerificationCode,
  deleteExpiredCodes,
  deleteVerificationCode,
  getCreatedAtVerificationCode,
  checkIfCodeExistByUuidAndType,
} from '@/utils/querys';

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
      ],
    });
  }

  async createVerifyCode(
    verificationCode: string,
    idType: string,
    userUuid: string,
    type: number,
  ) {
    return await turso.execute({
      sql: createVerificationCode(idType),
      args: [userUuid, verificationCode, type],
    });
  }

  generateNumericCode(code: string) {
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const numericCode = parseInt(hash.slice(0, 4), 16);

    return `${numericCode}`;
  }

  async isVerificationCodeExpired(
    column: string,
    uuid: string,
    code: string,
    type: number,
  ): Promise<Boolean> {
    const createdAtFromDB: { rows: Array<{ created_at: string }> } =
      await this.verificationCodeExist(column, uuid, code, type);

    const createdAt = new Date(createdAtFromDB.rows[0].created_at);

    const currentDate = new Date();

    const differenceInMilliseconds =
      currentDate.getTime() - createdAt.getTime();

    const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

    const isExpired = differenceInMinutes >= 5;

    if (isExpired) {
      await this.deleteVerificationCode(column, uuid, code);
      return true;
    }

    return false;
  }

  async verificationCodeExist(
    column: string,
    uuid: string,
    code: string,
    type: number,
  ): Promise<{ rows: Array<{ created_at: string }> }> {
    const result = await turso.execute(
      getCreatedAtVerificationCode(column, uuid, code, type),
    );

    const rows = result.rows.map((row) => ({
      created_at: row.created_at as string,
    }));

    return { rows };
  }

  async verifyCodeExistByUuidAndType(
    column: string,
    type: number,
    userId: string,
  ) {
    return await turso.execute({
      sql: checkIfCodeExistByUuidAndType(column),
      args: [type, userId],
    });
  }

  async deleteVerificationCode(column: string, uuid: string, code: string) {
    await turso.execute(deleteVerificationCode(column, uuid, code));
  }

  async deleteAllExpiredVerificationCodes() {
    return await turso.execute(deleteExpiredCodes);
  }
}
