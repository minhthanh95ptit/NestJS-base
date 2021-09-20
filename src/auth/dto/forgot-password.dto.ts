import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'User email.',
    example: 'example@test.com',
  })
  email: string;
}
