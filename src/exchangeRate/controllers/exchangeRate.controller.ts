import { Controller, Post, Body } from '@nestjs/common';
import { exchangeRateService } from '../services/exchangeRate.service';
import { exchangeRateDto } from '../dto/exchangeRate.dto';
import { ResponseObject } from '../responses/exchangeRate.response';

@Controller('exchangeRate')
export class exchangeRateController {
  constructor(private readonly exchangeRateService: exchangeRateService) {}
  @Post()
  validateExchangeRate(
    @Body() exchangeRateDto: exchangeRateDto,
  ): Promise<ResponseObject> {
    const { exchangeRate } = exchangeRateDto;
    return this.exchangeRateService.validateExchangeRate(exchangeRate);
  }
}
