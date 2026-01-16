import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ServiceAdmmin } from '../../../services/admin/admin';
import { InterfaceUser } from '../../../interfaces/user/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'home',
  standalone: true,
  templateUrl: './home.html',
  imports: [CommonModule, RouterLink]
})
export class AdminPage implements OnInit {

  users: InterfaceUser[] = [];
  loading = false;
  error = '';

  

  constructor(
    private adminService: ServiceAdmmin,
    private router: Router,
    private cd: ChangeDetectorRef
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

        this.cd.detectChanges();
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
      error: () => alert('No te puedes banear a ti mismo')
    });
  }

  unbanUser(user_id: number) {
    this.adminService.patchDataUnban(user_id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Failed to unban user')
    });
  }
}
