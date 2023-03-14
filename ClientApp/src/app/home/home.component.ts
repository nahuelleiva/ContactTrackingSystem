import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/models/contact';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { NotificationService } from '../shared/notifications.service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  displayStyle: string = "none";
  // values for searching contacts on the API
  firstName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  phoneNumber: string = "";
  zipCode: string = "";

  rows: Contact[] = [];
  columns = [{ prop: 'firstName' }, { name: 'Last Name' }, { name: 'Email Address' }, { name: 'Phone Number' }, { name: 'Residential ZIP Code' }];

  subscriptions = new Subscription();

  constructor(
    private _homeService: HomeService,
    private _notifications: NotificationService
  ) {}

  ngOnInit() {
    this.getContacts();

    this.subscriptions.add(this._notifications.clientData$.subscribe(r => {
      this._homeService.createContact(r).subscribe(() => {}, (error) => { console.log(error)});
      this.getContacts();
    }));
  }

  searchContacts() {
    this._homeService.searchContacts(this.firstName, this.lastName, this.emailAddress, this.phoneNumber, this.zipCode).subscribe(result => {
      this.rows = result;
    });
  }

  createContact() {
    this.openPopup();
  }

  openPopup() {
    this._notifications.emitOpenCloseModal("block");
  }

  getContacts() {
    this._homeService.getContacts().subscribe(result => {
      this.rows = result;
    });
  }
}
