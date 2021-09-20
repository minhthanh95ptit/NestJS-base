import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../modules/users/user.entity';
// eslint-disable-next-line
const mailchimp = require('@mailchimp/mailchimp_transactional')('a542b8a9e402ee79cc872b5f2fa95c6e-us5');


const message = {
  from_email: 'thanhpm@vmodev.com',
  subject: 'Hello world',
  text: 'Welcome to Mailchimp Transactional!',
  to: [
    {
      email: 'minhthanh95ptit@gmail.com',
      type: 'to',
    },
  ],
};
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  // async sendUserConfirmation(user: User, otpCode: string) {
  //   // const url = `example.com/auth/confirm?token=${token}`;

  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     // from: '"Support Team" <support@example.com>', // override default from
  //     subject: 'Welcome to Nice App! Confirm your Email',
  //     template: './confirmation', // `.hbs` extension is appended automatically
  //     context: { // ✏️ filling curly brackets with content
  //       name: user.email,
  //       otpCode,
  //     },
  //   });
  // }

  async sendUserConfirmation(user: User, otpCode: string) {
    const response = await mailchimp.messages.send({
      message,
    });
    return response
  }
}
