import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact } from 'src/models/contact';
import { NotificationService } from '../shared/notifications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'create-contact',
    templateUrl: './create-contact.component.html'
})
export class CreateContactComponent implements OnInit {
  displayStyle: string = "none";
  subscriptions = new Subscription();
  firstName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  phoneNumber: string = "";
  zipCode: string = "";
  createNewContactForm: FormGroup;
  submitted: boolean = false;

	constructor(
    private _notifications: NotificationService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService) {}

  ngOnInit(): void {
    this.subscriptions.add(this._notifications.openCloseModal$.subscribe(r => {
      this.displayStyle = r;
    }));

    this.createNewContactForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    });
  }

  closePopup() {
    this.displayStyle = "none";
    this.submitted = false;
  }

  submit() {
    this.submitted = true;

    if (this.createNewContactForm.invalid) {
      return;
    }

    this.createContact();
  }

  createContact() {
    let newContact = {
      firstName: this.firstName,
      lastName: this.lastName,
      emailAddress: this.emailAddress,
      phoneNumber: this.phoneNumber,
      residentialZipCode: this.zipCode
    } as Contact;

    this._notifications.emitClientData(newContact);
    this.closePopup();
    this._toastr.success("Contact created successfully!");
  }
}
