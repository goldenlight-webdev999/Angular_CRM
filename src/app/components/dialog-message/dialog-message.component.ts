import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.scss']
})
export class DialogMessageComponent {

    /**
     * DialogMessageComponent constructor
     *
     * @param dialogRef
     * @param data
     */
    constructor(
        public dialogRef: MatDialogRef<DialogMessageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
}
