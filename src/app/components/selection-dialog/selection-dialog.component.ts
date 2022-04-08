import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MetacleanerAPIService } from 'src/app/services/metacleaner-api.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss']
})
export class SelectionDialogComponent implements OnInit {
  paymentType: string;

  @Input() public planChosen: string;
  @Input() public lookupKey: string;
  @Output() public closeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public router: Router,
    public api: MetacleanerAPIService,
    public sessionHandler: SessionService,
  ) { }

  ngOnInit() {
  }

  openDialog(): void {
    /*console.log('yrsddf');
    const dialogRef = this.dialog.open(SelectionModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });*/
  }

  choosePayment(type): void {
    this.paymentType = type;
    /*if ( type === 'paypal') {
      $('.paypal-payment').css('border', 'green solid 2px');
      $('.card-payment').css('border', 'none');
    } else {
      $('.card-payment').css('border', 'green solid 2px');
      $('.paypal-payment').css('border', 'none');
    }*/
  }

  rdrChosen(): void {
    if ( this.paymentType === 'paypal') {
      this.api.getPaypalCheckoutSession(this.planChosen).subscribe(
        responseData => {
          console.log(responseData);
          if (responseData['payload']['url'] !== undefined) {
            window.location.href = responseData['payload']['url'];
          }
        },
        response => {
          this.sessionHandler.showError(response.error.payload);
        }
      );
    } else {
      this.api.getCheckoutSession(this.lookupKey).subscribe(
        responseData => {
          if (responseData['payload']['url'] !== undefined) {
            window.location.href = responseData['payload']['url'];
          }
        },
        response => {
          this.sessionHandler.showError(response.error.payload);
        }
      );
    }
  }

  close() {
    this.closeEmitter.emit();
  }

}
