import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/models/contact';
import { NotificationService } from '../shared/notifications.service';
import { HomeService } from './home.service';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { PaginatedResult } from 'src/models/paginated-result';

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
  paginatedResult: PaginatedResult;
  loadingResults = false;

  subscriptions = new Subscription();

  constructor(
    private _homeService: HomeService,
    private _notifications: NotificationService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadingResults = true;
    this.getContacts();

    this.subscriptions.add(this._notifications.clientData$.subscribe(r => {
      this._homeService.createContact(r).subscribe({
        next: () => {
          this._toastr.success("Contact has been created successfully!");
        },
        error: (error) => {
          this._toastr.error("An error has occurred while creating the contact. Consider checking the logs for further information");
          console.log(error);
        }
      });
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

  getContacts(pageSize: number = 5, pageNumber: number = 0) {
    this._homeService.getContacts(pageSize, pageNumber).subscribe({
      next: (result) => {
        this.paginatedResult = result;
        this.rows = result.contacts;
        this.loadingResults = false;
      },
      error: (err) => { console.log(err); }
    });
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo: any) {
    this.getContacts(pageInfo.pageSize, pageInfo.offset);
  }
}
