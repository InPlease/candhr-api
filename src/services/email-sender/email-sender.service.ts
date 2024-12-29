import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as Handlebars from 'handlebars';
import { signUpEmailTemplate } from '@/utils/email/email.templates';
import { emailLang } from '@/utils/lang/emails/lang';

@Injectable()
export class EmailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  private renderTemplate(
    url: string,
    code: string,
    user: string,
    language: string,
  ): string {
    const lang = emailLang[language].account_creation;
    const template = signUpEmailTemplate(
      code,
      user,
      lang.message_00,
      lang.message_01,
      lang.message_02,
      lang.message_03,
      lang.message_04,
      lang.message_05,
    );
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({ url });
  }

  async sendEmail(
    recipientEmail: string,
    subject: string,
    url: string,
    code: string,
    name: string,
    language: string,
  ): Promise<any> {
    const htmlContent = this.renderTemplate(url, code, name, language);

    try {
      const response = await this.mailerService.sendMail({
        to: recipientEmail,
        from: 'jhornancolina@gmail.com',
        subject: subject,
        html: htmlContent,
      });
      return response;
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
