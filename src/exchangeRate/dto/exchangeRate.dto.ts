import { IsString } from 'class-validator';

export class exchangeRateDto {
  @IsString()
  FXQL: string;
}
