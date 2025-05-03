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
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [MatButtonModule, MatIconModule],
})
export class FileUploadComponent implements OnInit {
  @Input() maxFile: number = 1;
  @Input() multiple: boolean = false;
  @Input() notAcceptable: string[] = [];
  selectedFile = signal<File[]>([]);
  isDraggingOver = false;

  @Output() fileReady = new EventEmitter<File[]>();
  @Output() error = new EventEmitter<any>();

  @ViewChild('fileUploadInput') fileInputRef!: ElementRef<HTMLInputElement>;

  baseAllowedTypes = [
    { extension: '.jpg', mimeType: 'image/jpeg' },
    { extension: '.jpeg', mimeType: 'image/jpeg' },
    { extension: '.png', mimeType: 'image/png' },
    { extension: '.pdf', mimeType: 'application/pdf' },
    { extension: '.doc', mimeType: 'application/msword' },
    {
      extension: '.docx',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { extension: '.xls', mimeType: 'application/vnd.ms-excel' },
    {
      extension: '.xlsx',
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ];
  constructor() {}

  ngOnInit() {}

  handleUploadFile(event: MouseEvent) {
    this.preventAndStopEvent(event);
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
    if (files?.length) {
      this.processFiles(files);
    }
  }

  private processFiles(files: FileList | null): void {
    const validFiles: File[] = [];
    const maxSizeInBytes = 25 * 1024 * 1024;
    const allowedMimeType = this.baseAllowedTypes
      .filter((type) => !this.notAcceptable.includes(type.extension))
      .map((type) => type.mimeType);

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
          'Invalid file type uploaded. Please upload the document in one of the supported formats',
        );
        continue;
      }

      if (file.size > maxSizeInBytes) {
        this.error.emit(
          'File size is too large. Please upload a file smaller than 25MB.',
        );
        continue;
      }

      validFiles.push(file);
    }

    this.multiple
      ? this.selectedFile.update((current) => [...current, ...validFiles])
      : this.selectedFile.set(validFiles);
    this.fileReady.emit(this.selectedFile());
  }

  remove(fileToRemove: File) {
    this.selectedFile.update((currentFiles) => {
      const updatedList = currentFiles.filter((f) => f !== fileToRemove);
      return updatedList;
    });
    this.fileReady.emit(this.selectedFile());
  }

  preventAndStopEvent(event: DragEvent | MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
