import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CryptoService } from '../crypto.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crypto-table',
  templateUrl: './crypto-table.component.html',
  styleUrls: ['./crypto-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CryptoTableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['symbol', 'priceChangePercent', 'volume', 'currentPrice'];
  cryptos: any[] = [];
  filteredCryptos: any[] = [];
  private subscription!: Subscription;

  constructor(private cryptoService: CryptoService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscription = this.cryptoService.getRealTimePrices().subscribe(data => {
      this.cryptos = data;
      if (this.filteredCryptos?.length) {
        this.filteredCryptos.forEach(x => {
          x.lastPrice = data?.find(d => d.symbol === x.symbol)?.lastPrice;
        });
      } else {
        this.filteredCryptos = data;
      }
      this.cdr.markForCheck();
    });
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '700px',
      data: { minVolume: 0, maxVolume: 1000000, minPriceChange: -100, maxPriceChange: 100, minPrice: 0, maxPrice: 100000 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applyFilters(result);
      }
    });
  }

  applyFilters(filters: any): void {
    this.filteredCryptos = this.cryptos.filter(crypto =>
      crypto.volume >= filters.minVolume &&
      crypto.volume <= filters.maxVolume &&
      crypto.priceChangePercent >= filters.minPriceChange &&
      crypto.priceChangePercent <= filters.maxPriceChange &&
      crypto.lastPrice >= filters.minPrice &&
      crypto.lastPrice <= filters.maxPrice
    );
    this.cdr.markForCheck();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
