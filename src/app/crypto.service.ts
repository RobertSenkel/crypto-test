import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private binanceApiUrl = 'https://api.binance.com/api/v3/ticker/24hr';

  constructor(private http: HttpClient) {}

  getCryptos(): Observable<any[]> {
    return this.http.get<any[]>(this.binanceApiUrl).pipe(
      map(data => data.filter(item => item.symbol.endsWith('USDT')))
    );
  }

  getRealTimePrices(): Observable<any[]> {
    return timer(0, 10000).pipe(
      switchMap(() => this.getCryptos())
    );
  }
}
