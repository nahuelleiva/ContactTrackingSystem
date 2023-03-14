import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact } from 'src/models/contact';
import { NotificationService } from '../shared/notifications.service';
import { Modal } from 'bootstrap';

@Component({
    selector: 'create-contact',
    templateUrl: './create-contact.component.html'
})
export class CreateContactComponent implements OnInit {
  @ViewChild("createContactModal") createContactModal: ElementRef;
  modal: Modal;

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
    private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.subscriptions.add(this._notifications.openCloseModal$.subscribe(r => {
      // Creating the modal in case the reference is null
      if (this.modal == null) {
        this.modal = new Modal(this.createContactModal.nativeElement);
      }

      this.modal.show();
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
    this.modal.hide();
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
  }
}
