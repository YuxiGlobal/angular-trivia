import { CoreService } from './../core.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.css']
})
export class FormDialogComponent {

  username: string;

  constructor(private coreService:CoreService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FormDialogComponent>) { }

  saveUserScore() {
    this.coreService.saveUserScore(this.username, this.data.score);
    this.dialogRef.close();
  }

}
