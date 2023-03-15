import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Contact } from "src/models/contact";
import { environment } from "src/environments/environment";
import { PaginatedResult } from "src/models/paginated-result";

@Injectable({
    providedIn: "root"
})
export class HomeService {
    constructor(private _http: HttpClient) {}

    getContacts(pageSize: number, pageNumber: number) {
        return this._http.get<PaginatedResult>(
          environment.baseURL + environment.api.getContacts,
          {
            params: {
              "pageSize": pageSize,
              "pageNumber": pageNumber
            }
          });
    }

    searchContacts(firstName: string = "", lastName: string = "", emailAddress: string = "", phoneNumber: string = "", zipCode: string = "") {
        return this._http.get<Contact[]>(
            environment.baseURL + environment.api.searchContacts,
            {
                params: {
                    "firstName": firstName,
                    "lastName": lastName,
                    "emailAddress": emailAddress,
                    "phoneNumber": phoneNumber,
                    "zipCode": zipCode
                }
            });
    }

    createContact(contact: Contact) {
      return this._http.post(
        environment.baseURL + environment.api.createContact,
        contact
      );
    }
}
