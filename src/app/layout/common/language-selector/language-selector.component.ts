import { Component } from '@angular/core';
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
    { code: 'fr', label: 'Français', flag: 'fi-fr' },
  ];

  currentLanguageFlag: string;

  constructor(private translate: TranslateService) {
    const languageCode = localStorage.getItem('language') ?? 'en';
    this.currentLanguageFlag =
      this.languages.find((lang) => lang.code === languageCode)?.flag ?? this.languages[0].flag;
    this.translate.use(languageCode);
  }

  setLanguage(code: string) {
    this.translate.use(code);
    localStorage.setItem('language', code);
    this.currentLanguageFlag = this.languages.find((lang) => lang.code === code)?.flag ?? this.languages[0].flag;
  }

  get currentLang() {
    return this.translate.currentLang || this.translate.defaultLang;
  }
}
