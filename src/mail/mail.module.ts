// import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { SendGridModule } from "@anchan828/nest-sendgrid";
@Module({
  imports: [
    SendGridModule.forRoot({
      apikey: process.env.SEND_GRID_API_KEY,
    }),
  ],
  controllers: [],
  providers: [],
})

export class MailModule {}
