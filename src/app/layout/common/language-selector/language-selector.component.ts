import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
})
export class LanguageSelectorComponent {
  languages = [
    { code: 'en', label: 'English', flag: 'fi-gb' },
    { code: 'es', label: 'Spanish', flag: 'fi-es' },
  ];

  currentLanguage = signal('');
  platformId = inject(PLATFORM_ID);

  currentLanguageFlag = computed(() => {
    const flag = this.languages.find((lang) => lang.code === this.currentLanguage())?.flag ?? this.languages[0].flag;
    return flag;
  });

  constructor(private translate: TranslateService) {
    let languageCode = 'en';
    if (isPlatformBrowser(this.platformId)) {
      languageCode = localStorage.getItem('language') ?? 'en';
    }
    this.currentLanguage.set(languageCode);
    this.translate.use(languageCode);
  }

  setLanguage(code: string) {
    this.translate.use(code);
    localStorage.setItem('language', code);
    this.currentLanguage.set(code);
  }

  get currentLang() {
    return this.translate.currentLang || this.translate.defaultLang;
  }
}
