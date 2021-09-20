import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import VerifyPassCodeDto from './dto/verify-pass-code.dto';
import ForgotPasswordDto from './dto/forgot-password.dto'
import { Request } from 'express';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

import { AuthDescription, AuthSummary } from './auth.constants';
import { CommonDescription } from 'src/common/constants/descriptions.constants';
import TokenResponseDto from './dto/token-response.dto';
import { ErrorResponse } from 'src/common/dto/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: AuthSummary.SIGN_UP_SUMMARY })
  @ApiBody({ type: AuthCreadentialsDto })
  @ApiCreatedResponse({
    description: AuthDescription.SIGN_UP_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiConflictResponse({
    description: AuthDescription.EMAIL_EXIST,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
  ): Promise<TokenResponseDto> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
  @ApiBody({ type: AuthCreadentialsDto })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCreadentialsDto,
  ): Promise<any> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/verify-pass-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AuthSummary.SIGN_IN_SUMMARY })
  @ApiBody({ type: VerifyPassCodeDto })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  async verifyPassCode(
    @Body(ValidationPipe) verifyPassCodeDto: VerifyPassCodeDto,
  ): Promise<TokenResponseDto> {
    return this.authService.verifyPassCode(verifyPassCodeDto);
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    return this.authService.sendEmailforgotPassword(forgotPasswordDto);
  }

  @Get('/new-password/:userId')
  async newPassword(
    @Req() request: Request
  ): Promise<any> {
    return this.authService.getNewPassword(request);
  }


  @Get('/facebook')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('facebook'))
  facebookSignIn(): Promise<void> {
    return;
  }

  @Get('/facebook/callback')
  @ApiOperation({ summary: 'Redirect site after facebook login has succeeded' })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard('facebook'))
  async facebookSignInCallback(@Req() req: Request): Promise<Express.User> {
    return this.authService.externalSignIn(req);
  }

  @Get('/google')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  googleSignIn(): Promise<void> {
    return;
  }

  @Get('/google/callback')
  @ApiOperation({ summary: 'Redirect site after facebook login has succeeded' })
  @ApiOkResponse({
    description: AuthDescription.SIGN_IN_SUCCESS,
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: AuthDescription.INVALID_CREDENTIALS,
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: CommonDescription.INTERNAL_SERVER_ERROR,
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request): Promise<Express.User> {
    return this.authService.externalSignIn(req);
  }
}
