import { SendGridService } from "@anchan828/nest-sendgrid";
import { Injectable } from '@nestjs/common';
import { User } from '../modules/users/user.entity';
// const sgMail = require('@sendgrid/mail');

const msg = {
  to: 'baodd@vmodev.com', // Change to your recipient
  from: 'thanhpm@vmodev.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  template_id: 'd-94d2ea113ae34ac8a2b15fb60d3047de'
}


@Injectable()
export class MailService {
  constructor(private sendGridService: SendGridService) {}

  // async sendUserConfirmation(user: User, otpCode: string) {
  //   // const url = `example.com/auth/confirm?token=${token}`;

  //   await this.sendGridService.sendMail({
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

  async sendLinkForGotPassWord() {
    // console.log(sgMail);
    // const url = `example.com/auth/confirm?token=${token}`;
    await this.sendGridService.send(msg);
    // return true
  }

}
