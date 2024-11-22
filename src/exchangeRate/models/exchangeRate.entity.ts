import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Currency } from '../dto/exchangeRate.enum';

@Entity('exchange_rates')
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  EntryId: number;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  SourceCurrency: Currency;

  @Column({
    type: 'enum',
    enum: Currency,
  })
  DestinationCurrency: Currency;

  @Column('decimal')
  SellPrice: number;

  @Column('decimal')
  BuyPrice: number;

  @Column()
  CapAmount: number;
}


