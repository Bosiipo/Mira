import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { exchangeRateController } from './exchangeRate/controllers/exchangeRate.controller';
import { exchangeRateService } from './exchangeRate/services/exchangeRate.service';
import { exchangeRateModule } from './exchangeRate/exchangeRate.module';
import { ExchangeRate } from './exchangeRate/models/exchangeRate.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false }
    }),
    exchangeRateModule,
    TypeOrmModule.forFeature([ExchangeRate])
  ],
  controllers: [AppController, exchangeRateController],
  providers: [AppService, exchangeRateService],
})
export class AppModule {}
