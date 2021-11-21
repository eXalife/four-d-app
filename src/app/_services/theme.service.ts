import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
  public isDarkTheme: Observable<boolean>;

  constructor() {
    this.isDarkTheme = this.isDarkThemeSubject.asObservable();
    const isDark = this.getThemeFromLocalStorage();
    if (isDark) this.changeIsDarkTheme(isDark);
  }

  changeIsDarkTheme(isDark: boolean) {
    this.isDarkThemeSubject.next(isDark);
    this.setThemeToLocalStorage(isDark);
  }

  getThemeFromLocalStorage(): boolean {
    return JSON.parse(localStorage.getItem('isDark')!);
  }

  setThemeToLocalStorage(isDark: boolean) {
    localStorage.setItem('isDark', JSON.stringify(isDark));
  }
}
