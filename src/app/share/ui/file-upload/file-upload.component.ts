import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [MatButtonModule],
})
export class FileUploadComponent implements OnInit {
  @Input() maxFile: number = 1;
  @Input() multiple: boolean = false;
  
  selectedFile = signal<File[]>([]);
  isDraggingOver = false;

  @Output() fileReady = new EventEmitter<File[]>();
  @Output() error = new EventEmitter<any>();

  @ViewChild('fileUploadInput') fileInputRef!: ElementRef<HTMLInputElement>;
  constructor() {}

  ngOnInit() {}

  handleUploadFile(event: MouseEvent) {
    this.preventAndStopEvent(event);
    this.selectedFile.set([]);
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.click();
    }
  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    this.processFiles(fileInput.files);
    fileInput.value = '';
  }

  onDragOver(event: DragEvent): void {
    this.preventAndStopEvent(event);
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.preventAndStopEvent(event);
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent): void {
    this.preventAndStopEvent(event);
    this.isDraggingOver = false;
    const files = event.dataTransfer?.files;
    this.selectedFile.set([]);
    if (files?.length) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList | null): void {
    const validFiles: File[] = [];
    const maxSizeInBytes = 25 * 1024 * 1024;
    const allowedMimeType = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!files || files.length === 0) {
      return;
    }

    if (files.length > this.maxFile) {
      this.error.emit(`Only accept ${this.maxFile} file upload`);
      this.selectedFile.set([]);
      this.fileReady.emit([]);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedMimeType.includes(file.type)) {
        this.error.emit(
          'Invalid file format. Please upload a valid Waste Carrier Licence.',
        );
        continue;
      }

      if (file.size > maxSizeInBytes) {
        const maxSizeInMB = (maxSizeInBytes / (1024 * 1024)).toFixed(1);
        this.error.emit(
          'File size is too large. Please upload a Waste Carrier Licence smaller than 25MB.',
        );
        continue;
      }

      validFiles.push(file);
    }

    this.selectedFile.set(validFiles);
    this.fileReady.emit(this.selectedFile());
  }

  preventAndStopEvent(event: DragEvent | MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
