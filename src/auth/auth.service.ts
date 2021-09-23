import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from 'src/mail/mail.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import VerifyPassCodeDto from './dto/verify-pass-code.dto';
import JwtPayload from './payloads/jwtPayload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import { genCode } from '../helpers/index'
import * as moment from "moment" 
import HttpResponse from '../common/constants/HTTPResponse'
import ForgotPasswordDto from './dto/forgot-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  /**
   * Sign up an user.
   * @param authCredentialsDto AuthCredentialDto.
   */
  async signUp(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    await this.usersService.create(authCredentialsDto);
    const payload: JwtPayload = { email: authCredentialsDto.email };
    const jwtAccessToken = await this.jwtService.signAsync(payload);
    return {
      jwtAccessToken
     };
  }

  /**
   * Sign in an user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async signIn(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<HttpResponse> {
    const payload = {
      code: '123456789'
    }
    const jwtAccessToken = await this.jwtService.sign(payload);
    // console.log(exp)
    // console.log(currentTimeNow)
    return {
      error: false,
      statusCode: HttpStatus.OK,
      data: { jwtAccessToken },
    }
  }

  async verifyPassCode(
    verifyPassCodeDto: VerifyPassCodeDto,
  ): Promise<TokenResponseDto> {
    const { email, passCode } = verifyPassCodeDto;
    const user = await this.usersService.getByEmail(email);

    // If user with email exist and the password is valid.
    if (user && user.passCode === passCode) {
      const payload: JwtPayload = { email };
      const jwtAccessToken = await this.jwtService.signAsync(payload);
      return { jwtAccessToken };
    }
    // Else return an error.
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }

  async sendEmailforgotPassword(
    forgotPassword: ForgotPasswordDto
  ): Promise<any> {
    const { email } = forgotPassword;

    const user = await this.usersService.getByEmail(email);
    const payload = {
      passCode: '123456'
    }

    const token = await this.jwtService.sign(payload)

    const url = `${process.env.APP_DOMAIN}:${process.env.APP_PORT}/auth/new-password/${user.id}?token=${token}`
    if(user){
      await this.mailService.sendLinkForGotPassWord()
      console.log(email);
      console.log(user);
      console.log(url);
      return true;
    }
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }

  async getNewPassword(
    request
  ): Promise<any> {
    const { userId } = request.params;
    const { token } = request.query;

    console.log(token);

    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
    
    if(!payload){
      throw new BadRequestException("token invalid or exprire")
    }
    
    console.log(payload);

    const { passCode, iat, exp } = payload;
    
    const currentTimeNow = moment().unix();
    console.log(currentTimeNow);
    console.log(iat);
    console.log(exp);
    if(currentTimeNow < iat || currentTimeNow > exp){
      throw new BadRequestException("token invalid or exprire");
    }

    if(passCode != '1234567'){
      throw new BadRequestException("passCode invalid");
    }

    return {
      msg: "sucess",
      statusCode: 200
    }
  }

  async externalSignIn(req: Request): Promise<Express.User> {
    return req.user;
  }
}
