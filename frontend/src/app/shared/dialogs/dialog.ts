import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export type DialogType = 'error' | 'warning' | 'info' | 'success' | 'question' | 'confirm';

export interface ComponentDialog {
  title: string;
  message: string;
  type: DialogType;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-custom-dialog',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class ComponentCustomDialog {
  iconMap: Record<DialogType, string> = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'check_circle',
    question: 'help',
    confirm: 'help',
  };

  colorMap: Record<DialogType, string> = {
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#22c55e',
    question: '#6366f1',
    confirm: '#6366f1',
  };

  constructor(
    private ref: MatDialogRef<ComponentCustomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ComponentDialog
  ) {}

  close(result: boolean) {
    this.ref.close(result);
  }
}
