import { Component, OnInit } from '@angular/core';
import { ServiceAdmmin } from '../../../services/admin/admin';
import { InterfaceUser } from '../../../interfaces/user/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.html',
  imports: [CommonModule]
})
export class AdminPage implements OnInit {

  users: InterfaceUser[] = [];
  loading = false;
  error = '';

  constructor(
    private adminService: ServiceAdmmin,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getData().subscribe({
      next: (resp: any) => {
        this.users = resp.users ?? resp;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load users';
        this.loading = false;
      }
    });
  }

  banUser(user_id: number) {
    this.adminService.patchDataBan(user_id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to ban user')
    });
  }

  unbanUser(user_id: number) {
    this.adminService.patchDataUnban(user_id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to unban user')
    });
  }
}
