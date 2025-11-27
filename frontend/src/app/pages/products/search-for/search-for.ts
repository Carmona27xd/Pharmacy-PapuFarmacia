import { Component } from '@angular/core';

@Component({
  selector: 'page-search-for',
  standalone: true,
  imports: [],
  templateUrl: './search-for.html',
})
export class PageSearchForProducts {
  results: any[] = [];
  searchQuery: string = '';

  constructor() {}
}
