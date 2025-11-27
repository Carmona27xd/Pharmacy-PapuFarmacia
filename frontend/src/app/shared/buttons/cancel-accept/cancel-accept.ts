import { Component } from '@angular/core';

@Component({
  selector: 'app-cancel-accept-buttons',
  imports: [],
  templateUrl: './cancel-accept.html',
})
export class ComponentCancelAcceptButtons {
  buttonCancelText = 'Cancelar';
  buttonAcceptText = 'Aceptar';

  onClickCancel() {
    console.log('Cancel button clicked');
  }
  onClickAccept() {
    console.log('Accept button clicked');
  }
}
