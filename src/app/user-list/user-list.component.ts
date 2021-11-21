import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Roles } from '../_models/roles';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { UserListDialogComponent } from './user-list-dialog/user-list-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  currentUser: User;
  allUsers: User[];
  filteredUsers: User[];
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.subscription = this.authService.currentUser.subscribe(
      (u) => (this.currentUser = u)
    );
  }

  ngOnInit(): void {
    this.fillUsersByCurrentUserRole();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  fillUsersByCurrentUserRole(): void {
    this.allUsers = this.userService.getUsersFromLocalStorage();
    if (this.currentUser?.role === Roles.Admin) {
      // filter admins
      this.filteredUsers = this.allUsers.filter(
        (u) => u.role === Roles.Customer
      );
    } else {
      // remove self
      this.filteredUsers = this.allUsers?.filter(
        (u) => u.userName !== this.currentUser.userName
      );
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(UserListDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allUsers.push(result);
        this.userService.setUsersToLocalStorage(this.allUsers);
        this.fillUsersByCurrentUserRole();
      }
    });
  }

  editUser(user: User): void {
    const index = this.allUsers.findIndex((u) => u.userName === user.userName);

    const dialogRef = this.dialog.open(UserListDialogComponent, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allUsers.splice(index, 1, result);
        this.userService.setUsersToLocalStorage(this.allUsers);
        this.fillUsersByCurrentUserRole();
      }
    });
  }

  removeUser(user: User) {
    const index = this.allUsers.findIndex((u) => u.userName === user.userName);

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allUsers.splice(index, 1);
        this.userService.setUsersToLocalStorage(this.allUsers);
        this.fillUsersByCurrentUserRole();
      }
    });
  }
}
