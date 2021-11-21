import { Injectable } from '@angular/core';
import { Roles } from '../_models/roles';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[];

  constructor() {
    this.users = [
      { userName: 'superadmin1', role: Roles.SuperAdmin },
      { userName: 'admin1', role: Roles.Admin },
      { userName: 'admin2', role: Roles.Admin },
      { userName: 'customer1', role: Roles.Customer },
      { userName: 'customer2', role: Roles.Customer },
      { userName: 'customer3', role: Roles.Customer },
    ];
  }

  getUsers(): User[] {
    return this.users;
  }

  getUsersFromLocalStorage(): User[] {
    const userDB: User[] = JSON.parse(localStorage.getItem('userDB')!);
    return userDB;
  }

  setUsersToLocalStorage(users: User[]) {
    localStorage.setItem('userDB', JSON.stringify(users));
  }
}
