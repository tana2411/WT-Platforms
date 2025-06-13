import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-preview-modal',
  templateUrl: 'admin-document-preview-modal.component.html',
  styleUrls: ['admin-document-preview-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule],
})
export class DocumentPreviewModalComponent {
  // resourceUrl: string;
  safeUrl = signal<SafeResourceUrl | undefined>(undefined);
  http = inject(HttpClient);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<DocumentPreviewModalComponent>,
  ) {
    const resourceUrl = data.url;
    // Only trust URLs from your own domain or a whitelist!
    this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(resourceUrl));
  }

  async download() {
    debugger;
    const url = this.data.url;
    const fileName = url.split('/').pop()?.split('?')[0] || 'download';
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(url, '_blank', 'noopener');
    }
  }

  close() {
    this.dialogRef.close();
  }
}
