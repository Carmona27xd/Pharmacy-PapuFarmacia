import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentCustomDialog, ComponentDialog, DialogType } from './dialog';

@Injectable({
  providedIn: 'root',
})
export class ServiceShowCustomDialog {
  constructor(private dialog: MatDialog) {}

  open(type: DialogType, title: string, message = '') {
    return this.dialog.open(ComponentCustomDialog, {
      width: '380px',
      data: { type, title, message },
    });
  }

  error(title: string, message = '') {
    return this.open('error', title, message);
  }

  warning(title: string, message = '') {
    return this.open('warning', title, message);
  }

  info(title: string, message = '') {
    return this.open('info', title, message);
  }

  success(title: string, message = '') {
    return this.open('success', title, message);
  }

  question(title: string, message = '') {
    return this.dialog
      .open(ComponentCustomDialog, {
        width: '380px',
        data: {
          type: 'question',
          title,
          message,
          confirmText: 'Sí',
          cancelText: 'No',
        },
      })
      .afterClosed();
  }

  confirm(title: string, message = '') {
    return this.question(title, message);
  }
}
