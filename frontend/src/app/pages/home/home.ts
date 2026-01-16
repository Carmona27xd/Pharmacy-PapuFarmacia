import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { ServiceAuth } from '../../services/auth/auth';


@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class PageHome implements OnInit {

  isUserAdmin: boolean = false;
  constructor(private authService: ServiceAuth) {}

  ngOnInit(): void {
    this.isUserAdmin = this.authService.isAdmin();
  }
}
