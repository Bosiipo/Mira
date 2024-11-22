import { IsString } from 'class-validator';

export class exchangeRateDto {
  @IsString()
  exchangeRate: string;
}
