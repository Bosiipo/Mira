import { ExchangeRate } from '../models/exchangeRate.entity';

export class RateEntry {
  constructor(
    public EntryId: number,
    public SourceCurrency: string,
    public DestinationCurrency: string,
    public SellPrice: number,
    public BuyPrice: number,
    public CapAmount: number,
    public CurrencyPair: string,
  ) {}
}

export class ResponseObject {
  constructor(
    public message: string,
    public code: string,
    public data: ExchangeRate[],
  ) {}
}

