import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-accept-buttons',
  imports: [],
  templateUrl: './cancel-accept.html',
})
export class ComponentCancelAcceptButtons {
  buttonCancelText = 'Cancelar';
  buttonAcceptText = 'Aceptar';

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() accept: EventEmitter<void> = new EventEmitter<void>();

  onClickCancel() {
    this.cancel.emit();
  }

  onClickAccept() {
    this.accept.emit();
  }
}
