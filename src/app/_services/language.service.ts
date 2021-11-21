import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor() {}

  getLanguageFromLocalStorage(): string | null {
    return localStorage.getItem('language');
  }

  setLanguageToLocalStorage(language: string) {
    localStorage.setItem('language', language);
  }
}
