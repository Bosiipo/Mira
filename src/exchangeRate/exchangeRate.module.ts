import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './models/exchangeRate.entity';
import { exchangeRateService } from './services/exchangeRate.service';
import { exchangeRateController } from './controllers/exchangeRate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  controllers: [exchangeRateController],
  providers: [exchangeRateService],
  exports: [exchangeRateService],
})
export class exchangeRateModule {}
