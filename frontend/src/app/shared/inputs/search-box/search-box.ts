import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentSearchSvg } from '../../../../assets/search-svg';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [ComponentSearchSvg, FormsModule],
  templateUrl: './search-box.html',
})
export class ComponentSearchBox {
  searchQuery: string = '';

  constructor(private router: Router) {}

  onSearch(): void {
    const query = this.searchQuery.trim();

    if (query.length > 0) {
      this.router.navigate(['/productos/buscar/', query]);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }
}
