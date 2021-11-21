import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { LanguageService } from '../_services/language.service';
import { ThemeService } from '../_services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm = this.formBuilder.group({
    userName: ['', Validators.required],
  });
  isDarkModeChecked: boolean;
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService,
    private languageService: LanguageService,
    public translate: TranslateService
  ) {
    this.subscription = this.themeService.isDarkTheme.subscribe(
      (isDark) => (this.isDarkModeChecked = isDark)
    );
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  login(): void {
    const user: User | undefined = this.authService.login(
      this.loginForm.value.userName
    );
    if (user) {
      this.router.navigate(['']);
      this.loginForm.reset();
    } else {
      this.loginForm.controls.userName.setErrors({ incorrect: true });
      this.snackBar.open(this.translate.instant('wrong_user_name'), '', {
        duration: 3000,
      });
    }
  }

  getLanguage(): string {
    const language: string | null =
      this.languageService.getLanguageFromLocalStorage();
    return language ? language : 'en';
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.languageService.setLanguageToLocalStorage(language);
  }

  setTheme(isDark: boolean): void {
    this.themeService.changeIsDarkTheme(isDark);
  }
}
