import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-share-listing',
  imports: [MatButtonModule],
  templateUrl: './share-listing.component.html',
  styleUrl: './share-listing.component.scss',
})
export class ShareListingComponent {
  @Input() url: string = window.location.href;
  @Input() title: string = 'Check out this listing';

  shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.url)}`;
    window.open(url, '_blank');
  }

  shareToLinkedIn() {
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(this.url)}&title=${encodeURIComponent(this.title)}`;
    window.open(url, '_blank');
  }

  shareByEmail() {
    const url = `mailto:?subject=${encodeURIComponent(this.title)}&body=${encodeURIComponent(this.url)}`;
    window.location.href = url;
  }

  shareToTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.title)}&url=${encodeURIComponent(this.url)}`;
    window.open(url, '_blank');
  }

  shareToWhatsApp() {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.title + ' ' + this.url)}`;
    window.open(url, '_blank');
  }
}
