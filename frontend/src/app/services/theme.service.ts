import { computed, Injectable, signal } from '@angular/core';

export interface AppTheme {
  name: 'light' | 'dark' | 'system';
  icon: string;
}
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  appTheme = signal<'light' | 'dark' | 'system'>('system');

  themes: AppTheme[] = [
    { name: 'light', icon: 'light_mode' },
    { name: 'dark', icon: 'dark_mode' },
    { name: 'system', icon: 'desktop_windows' }
  ];
  constructor() { }

  selectedTheme(): AppTheme | undefined {
    return this.themes.find((theme) => theme.name === this.appTheme());
  };
  getThemes() {
    return this.themes;
  }

  setTheme(name: 'light' | 'dark' | 'system') {
    this.appTheme.set(name);
  }

  setSystemTheme() {
    const appTheme = this.appTheme();  
    const colorScheme = appTheme === 'system' ? 'light dark' : appTheme;
    document.body.style.colorScheme = colorScheme;
  } 
}
