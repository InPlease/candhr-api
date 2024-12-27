// Dependencies
import { Injectable, PipeTransform } from '@nestjs/common';

// Models
import { SignUpDataModel } from '@/models/auth.model';

@Injectable()
export class CurrentDatePipe implements PipeTransform {
  transform(value: SignUpDataModel) {
    value.create_at = new Date();
    value.update_at = new Date();

    return value;
  }
}
