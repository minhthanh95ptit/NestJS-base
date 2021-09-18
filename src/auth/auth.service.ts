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
    return { jwtAccessToken };
  }

  /**
   * Sign in an user.
   * @param authCredentialsDto AuthCredentialsDto.
   */
  async signIn(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<boolean> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.getByEmail(email);

    // If user with email exist and the password is valid.
    if (user && (await user.validatePassword(password))) {
      const passCode = genCode(6, 'numeric');
      console.log(passCode);
      await this.usersService.update(user.id, { passCode });
      await this.mailService.sendUserConfirmation(user, passCode);
      return true;
    }
    // Else return an error.
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
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

  async externalSignIn(req: Request): Promise<Express.User> {
    return req.user;
  }
}
