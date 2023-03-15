import { Contact } from "./contact";

export class PaginatedResult {
  // The total number of elements
  totalRecords: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // Current page number
  pageNumber: number = 0;
  // Size of the page
  pageSize: number = 5;
  // The current page number
  contacts: Contact[];
}
