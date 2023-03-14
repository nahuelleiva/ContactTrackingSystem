import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Contact } from "src/models/contact";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private openCloseModal = new Subject<any>();
  public openCloseModal$ = this.openCloseModal.asObservable();

  private clientData = new Subject<Contact>();
  public clientData$ = this.clientData.asObservable();

  emitOpenCloseModal(style: string) {
    this.openCloseModal.next(style);
  }

  emitClientData(clientObj: Contact) {
    this.clientData.next(clientObj);
  }
}
