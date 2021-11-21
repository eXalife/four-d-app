import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Roles } from '../_models/roles';
import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { LanguageService } from '../_services/language.service';
import { ThemeService } from '../_services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  currentUser: User;
  isDarkModeChecked: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private languageService: LanguageService,
    public translate: TranslateService
  ) {
    this.subscriptions.push(
      this.authService.currentUser.subscribe((u) => (this.currentUser = u))
    );

    this.subscriptions.push(
      this.themeService.isDarkTheme.subscribe(
        (isDark) => (this.isDarkModeChecked = isDark)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions?.forEach((subscription) => subscription?.unsubscribe());
  }

  controlRoleForListAllowance(): boolean {
    return this.currentUser?.role !== Roles.Customer;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getLanguage(): string | null {
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
