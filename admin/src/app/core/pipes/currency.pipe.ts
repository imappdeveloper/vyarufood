import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyINR', standalone: true })
export class CurrencyINRPipe implements PipeTransform {
  transform(value: number, symbol: string = '\u20B9'): string {
    if (value === null || value === undefined) return `${symbol}0.00`;
    return `${symbol}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
