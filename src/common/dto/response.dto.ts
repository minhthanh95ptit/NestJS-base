import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CommonError } from '../constants/errors.constants';
import { CommonMessage } from '../constants/messages.constants';

export class ErrorResponse {
  @ApiProperty({
    description: 'HTTP response status code.',
    example: [
      HttpStatus.BAD_REQUEST,
      HttpStatus.CONFLICT,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ],
  })
  statusCode: number;

  @ApiProperty({
    description: 'Message to display.',
    example: [CommonMessage.NOT_FOUND_BY_ID, CommonMessage.ALREADY_EXIST],
  })
  message: string;

  @ApiProperty({
    description: 'Error to display from HTTP exception.',
    example: [CommonError.CONFLICT, CommonError.INTERNAL_SERVER_ERROR],
  })
  error: string;
}
