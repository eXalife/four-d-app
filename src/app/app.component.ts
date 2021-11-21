import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { EN_TRANSLATIONS } from './_i18n/en';
import { TR_TRANSLATIONS } from './_i18n/tr';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';
import { LanguageService } from './_services/language.service';
import { ThemeService } from './_services/theme.service';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUser: User;
  subscription: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private authService: AuthService,
    private userService: UserService,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private translate: TranslateService
  ) {
    // set current logged in user if any
    this.subscription = this.authService.currentUser.subscribe(
      (u) => (this.currentUser = u)
    );

    translate.setTranslation('tr', TR_TRANSLATIONS);
    translate.setTranslation('en', EN_TRANSLATIONS);
    translate.setDefaultLang('en');

    const language = this.languageService.getLanguageFromLocalStorage();
    if (language) translate.use(language);
  }

  ngOnInit(): void {
    this.themeService.isDarkTheme.subscribe((isDark: boolean) => {
      this.setTheme(isDark);
    });
  }

  ngAfterViewInit(): void {
    // set up local storage user records if not any
    if (!this.userService.getUsersFromLocalStorage())
      this.userService.setUsersToLocalStorage(this.userService.getUsers());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  setTheme(isDark: boolean) {
    const hostClass = isDark ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);
  }
}
