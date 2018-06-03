import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WTimeDialogComponent } from '../w-time-dialog/w-time-dialog.component';
import { ITime } from '../w-clock/w-clock.component';
import { WTimeComponent } from '../w-time/w-time.component';

@Component({
  selector: 'w-mat-timepicker',
  styles: [
    `
      .time-picker-button {
        padding: 0;
        margin: 0;
        min-width: 44px;
      }
    `,
  ],
  template: `
    <div fxFlex fxLayout="row" class="w-mat-timepicker">

      <mat-form-field fxFlex class="timeContainer">
        <input matInput
               class="timeInput"
               placeholder="Select time"
               id="time_Control"
               name="time_Control"
               [value]="time"
        >
        <button mat-button (click)="showPicker($event)" class="time-picker-button">
          <mat-icon>access_time</mat-icon>
        </button>
      </mat-form-field>
    </div>
  `,
})
export class WMatTimePickerComponent implements OnInit {
  @Input() userTime: ITime;
  @Output() userTimeChange: EventEmitter<ITime> = new EventEmitter();

  @Input() color: string;

  @Input('for') timepicker: WTimeComponent;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    if (!this.userTime) {
      this.userTime = {
        hour: 10,
        minute: 25,
        meriden: 'PM',
        format: 24,
      };
    }
  }

  get time(): string {
    if (!this.userTime) {
      return '';
    }

    let meriden = `${this.userTime.meriden}`;
    if (this.userTime.format === 24) {
      meriden = '';
    }

    let hour = `${this.userTime.hour}`;
    if (this.userTime.hour === 24) {
      hour = '00';
    }

    if (this.userTime.minute === 0) {
      let value = `${hour}:00`;
      if (meriden) value += ` ${meriden}`;
      return value;
    } else if (this.userTime.minute < 10) {
      const tt = '0' + String(this.userTime.minute);
      let value = `${hour}:${tt}`;
      if (meriden) value += ` ${meriden}`;
      return value;
    } else {
      let value = `${hour}:${this.userTime.minute}`;
      if (meriden) value += ` ${meriden}`;
      return value;
    }
  }

  public showPicker($event) {
    const dialogRef = this.dialog.open(WTimeDialogComponent, {
      data: {
        time: {
          hour: this.userTime.hour,
          minute: this.userTime.minute,
          meriden: this.userTime.meriden,
          format: this.userTime.format,
        },
        color: this.color,
      },
    });

    dialogRef.afterClosed().subscribe((result: ITime | -1) => {
      // result will be update userTime object or -1 or undefined (closed dialog w/o clicking cancel)
      if (result === undefined) {
        return;
      } else if (result !== -1) {
        this.userTime = result;
        this.emituserTimeChange();
      }
    });
    return false;
  }

  private emituserTimeChange() {
    this.userTimeChange.emit(this.userTime);
  }
}
