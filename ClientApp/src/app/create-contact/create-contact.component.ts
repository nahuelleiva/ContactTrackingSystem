import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Contact } from 'src/models/contact';
import { NotificationService } from '../shared/notifications.service';
import { Modal } from 'bootstrap';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { CustomValidators } from './custom-validators/custom-validators';

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
  phoneCountryCode: number;
  countryCodes: number[] = [];
  zipCode: string = "";
  createNewContactForm: FormGroup;
  submitted: boolean = false;

	constructor(
    private _notifications: NotificationService,
    private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initCountryCodes();
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
      countryCode: [this.phoneCountryCode],
      phoneNumber: ['', [Validators.required]],
      zipCode: ['', [Validators.required]]
    }, {
      validator: this.phoneCrossCheckValidator
    });
  }

  phoneCrossCheckValidator(form: FormGroup): void {
    if ((form?.controls?.phoneNumber?.value || '').length > 0) {
      CustomValidators.phoneNumberValidator(form);
    }
  }

  initCountryCodes() {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const countries: string[] = phoneNumberUtil.getSupportedRegions();

    // add Argentina as initial value
    this.countryCodes.push(54);

    countries.forEach(country => {
      const countryCode = phoneNumberUtil.getCountryCodeForRegion(country);
      if (this.countryCodes.indexOf(countryCode) === -1) {
        this.countryCodes.push(countryCode);
      }
    });

    // sorting the list in ascending order
    this.countryCodes.sort((a, b) => a > b ? 1 : -1);
    this.phoneCountryCode = phoneNumberUtil.getCountryCodeForRegion('AR');
  }

  setCountryCode(event: any) {
    this.phoneCountryCode = event.target.value;
  }


  closePopup() {
    this.modal.hide();
    this.submitted = false;
    this.createNewContactForm.reset();
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
      firstName: this.createNewContactForm.value.firstName,
      lastName: this.createNewContactForm.value.lastName,
      emailAddress: this.createNewContactForm.value.emailAddress,
      phoneNumber: this.createNewContactForm.value.countryCode + this.createNewContactForm.value.phoneNumber,
      phoneCountryCode: JSON.stringify(this.createNewContactForm.value.countryCode),
      residentialZipCode: this.createNewContactForm.value.zipCode
    } as Contact;

    this._notifications.emitClientData(newContact);
    this.closePopup();
  }
}
