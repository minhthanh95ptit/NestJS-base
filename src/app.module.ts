import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './configs/database/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { MailchimpModule } from '@ntegral/nestjs-mailchimp';
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, UsersModule,MailchimpModule.forRoot({
    apikey: 'a542b8a9e402ee79cc872b5f2fa95c6e-us5'
  }),],
  controllers: [],
  providers: [],
})
export class AppModule {}
