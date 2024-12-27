// Dependencies
import { PipeTransform, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Models
import { SignUpDataModel } from '@/models/auth.model';

@Injectable()
export class CryptoCreatorPipe implements PipeTransform {
  async transform(value: SignUpDataModel) {
    const hashedId = await bcrypt.hash(value.password, 15);
    const hashedPassword = await bcrypt.hash(value.password, 10);

    return {
      ...value,
      id: hashedId,
      password: hashedPassword,
    };
  }
}
