import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../models/exchangeRate.entity';
import { Currency, TransactionKey } from '../dto/exchangeRate.enum';
import { ResponseObject } from '../responses/exchangeRate.response';

@Injectable()
export class exchangeRateService {
  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  validateCountryCode = (input: string): boolean => {
    // Regular expression to check for exactly three capital letters
    const regex = /^[A-Z]{3}$/;
  
    // Test the input against the regex
    return regex.test(input);
  }
  
  validateCurrency = (rawCurrencyPair) => {
    // console.log({ rawCurrencyPair });
    const splitCurrency = rawCurrencyPair.split(' ');
    // console.log({ splitCurrency });
    if (splitCurrency.length < 2) {
      throw new Error('Missing single space after currency pair!');
    }
    const currencyPair = splitCurrency[0].replace(/n/g, '');
    const [SourceCurrency, DestinationCurrency] = currencyPair.split('-');
    // console.log({ SourceCurrency, DestinationCurrency, currencyPair });
    if (!this.validateCountryCode(SourceCurrency)) {
      throw new Error(
        `${SourceCurrency} does not follow rules and constraints for currency input!`,
      );
    }
  
    if (!this.validateCountryCode(DestinationCurrency)) {
      throw new Error(
        `${DestinationCurrency} does not follow rules and constraints for currency input!`,
      );
    }
    return [SourceCurrency, DestinationCurrency];
  };
  
  validateRate = ({ transactionKey, transactionValue }) => {
    // console.log({ transactionKey, transactionValue });
    const currencyTransactionEnum = Object.values(TransactionKey);
    if (!currencyTransactionEnum.includes(transactionKey)) {
      throw new Error('Invalid transaction key!');
    }
  
    if (transactionKey === TransactionKey.CAP) {
      if (transactionValue.includes('.')) {
        throw new Error('No decimals are allowed for CAP!');
      }
    }
    const parsedDigit = Number(transactionValue);
    if (Number.isNaN(parsedDigit) || parsedDigit < 0) {
      throw new Error('Value is not valid!');
    }
  
    return parsedDigit;
  };

  async saveExchangeRates(data: ExchangeRate[]): Promise<ExchangeRate[]> {
    // Save the data to the database
    const savedData = await this.exchangeRateRepository.save(data);

    // Return the saved data including the generated IDs
    return Array.isArray(savedData) ? savedData : [savedData];
  }

  async validateExchangeRate(statement: string): Promise<ResponseObject> {
    if (statement.length === 0) {
      throw new Error('Enter a statement!');
    }

    const splitInput: string[] = statement.split('\\');
    const refinedData: ExchangeRate[] = [];
    const prototype: ExchangeRate = {
      SourceCurrency: Currency.null,
      DestinationCurrency: Currency.null,
      BuyPrice: 0,
      SellPrice: 0,
      CapAmount: 0,
    };
    let startingPointer: number = 0;
    let closingPointer: number = 0;
    let closingBlock: string = splitInput[closingPointer];
    const firstIteration: string = splitInput[0];
    if (firstIteration.split(' ').length !== 2) {
      throw new Error('Input not complete!');
    }

    while (startingPointer <= splitInput.length) {
      const current: string = splitInput[closingPointer];
      startingPointer = closingPointer;
      closingPointer += 4;
      closingBlock = splitInput[closingPointer];

      if (closingBlock === undefined) break;

      if (!closingBlock.includes('}')) {
        throw new Error('Invalid syntax!');
      }

      while (current.includes('{')) {
        const currentIteration: string = splitInput[startingPointer];

        if (currentIteration === 'n}') {
          break;
        }

        const [SourceCurrency, DestinationCurrency] =
          this.validateCurrency(currentIteration);
  
        prototype.SourceCurrency = SourceCurrency;
        prototype.DestinationCurrency = DestinationCurrency;
        startingPointer++;

        while (startingPointer < closingPointer) {
          const rate: string = splitInput[startingPointer];
          const [, , transactionKey, transactionValue] = rate.trim().split(' ');
          const refinedRate: number = this.validateRate({
            transactionKey,
            transactionValue,
          });

          if (transactionKey === TransactionKey.BUY) {
            prototype.BuyPrice = refinedRate;
          } else if (transactionKey === TransactionKey.SELL) {
            prototype.SellPrice = refinedRate;
          } else if (transactionKey === TransactionKey.CAP){
            prototype.CapAmount = refinedRate;
          }

          startingPointer++;
        }
      }
      refinedData.push(prototype);
      closingPointer += 2;
      startingPointer++;
    }
    const data: ExchangeRate[] = await this.saveExchangeRates(refinedData);
    console.log({ data });
    return new ResponseObject('Successful!', 'FXQL-201', data);
  }


}


