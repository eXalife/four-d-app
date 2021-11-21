import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/_models/roles';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-list-dialog',
  templateUrl: './user-list-dialog.component.html',
  styleUrls: ['./user-list-dialog.component.scss'],
})
export class UserListDialogComponent implements OnDestroy {
  currentUser: User;
  userForm: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    role: ['', Validators.required],
  });
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserListDialogComponent>,
    public translate: TranslateService,

    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.subscription = this.authService.currentUser.subscribe(
      (u) => (this.currentUser = u)
    );
    if (data) {
      this.userForm.patchValue(data);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveUser(): void {
    const allUsers = this.userService.getUsersFromLocalStorage();
    const user: User = {
      userName: this.userForm.value.userName,
      role: this.userForm.value.role,
    };

    if (
      allUsers.some((u) => u.userName === user.userName) &&
      user.userName !== this.data?.userName
    ) {
      this.snackBar.open(this.translate.instant('user_name_exist'), '', {
        duration: 3000,
      });
      return;
    }

    this.dialogRef.close(user);
  }

  public get roles(): typeof Roles {
    return Roles;
  }
}
