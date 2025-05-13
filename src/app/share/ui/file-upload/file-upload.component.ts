import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { pastDateValidator } from '@app/validators';
import { Moment } from 'moment';

export interface FileInfo {
  file: File;
  expirationDate: Moment | null;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
})
export class FileUploadComponent implements OnInit {
  @Input() maxFile: number = 1;
  @Input() required: boolean = true;
  @Input() expirationDateMode: 'required' | 'optional' | 'hidden' = 'required';
  @Input() notAcceptable: string[] = []; // ex: ['.jpg', '.jpeg']
  @Input() isFutureDate: boolean = false;

  @Output() filesAdded = new EventEmitter<FileInfo[]>();
  @Output() uploadValid = new EventEmitter<boolean>();

  @ViewChild('fileUploadInput') fileInputRef!: ElementRef<HTMLInputElement>;

  isDraggingOver = false;

  formGroup = new FormGroup({
    documents: new FormArray([], []),
  });

  snackBar = inject(MatSnackBar);

  get documents(): FormArray {
    return this.formGroup.get('documents') as FormArray;
  }

  baseAllowedTypes = [
    { extension: '.jpg', mimeType: 'image/jpeg' },
    { extension: '.jpeg', mimeType: 'image/jpeg' },
    { extension: '.png', mimeType: 'image/png' },
    { extension: '.pdf', mimeType: 'application/pdf' },
    { extension: '.doc', mimeType: 'application/msword' },
    {
      extension: '.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    { extension: '.xls', mimeType: 'application/vnd.ms-excel' },
    {
      extension: '.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  ];
  constructor() {
    this.documents.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.documents.valid) {
        if (this.required && this.documents.length > 0) {
          this.uploadValid.emit(true);
          this.filesAdded.emit(this.getFileInfos());
          return;
        }
      }
      if (this.documents.length == 0) {
        this.filesAdded.emit(this.getFileInfos());
      }
      this.uploadValid.emit(false);
    });
  }

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
    if (this.documents.length >= this.maxFile) {
      this.snackBar.open(`Only accept ${this.maxFile} file(s) upload`);
      return;
    }

    const maxSizeInBytes = 25 * 1024 * 1024;
    const allowedMimeType = this.baseAllowedTypes
      .filter((type) => !this.notAcceptable.includes(type.extension))
      .map((type) => type.mimeType);

    if (!files || files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedMimeType.includes(file.type)) {
        this.snackBar.open('Invalid file type uploaded. Please upload the document in one of the supported formats');
        continue;
      }

      if (file.size > maxSizeInBytes) {
        this.snackBar.open('File size is too large. Please upload a file smaller than 25MB.');
        continue;
      }

      this.addNewFileControl(file, this.expirationDateMode, this.isFutureDate);
    }
  }

  private addNewFileControl(file: File, expirationDateMode: string, isFutureDate: boolean) {
    const validators = [];

    if (this.expirationDateMode === 'required') {
      validators.push(Validators.required);
    }

    if (this.expirationDateMode !== 'hidden' && this.isFutureDate) {
      validators.push(pastDateValidator());
    }
    const fileControl = new FormGroup({
      file: new FormControl<File>(file),
      expirationDate: new FormControl<Moment | null>(null, validators),
    });

    if (isFutureDate) {
      fileControl.get('expirationDate')?.addValidators(pastDateValidator());
    }
    this.documents.push(fileControl);
  }

  private getFileInfos(): FileInfo[] {
    return this.documents.value;
  }

  remove(fileIndex: number) {
    this.documents.removeAt(fileIndex);
  }

  preventAndStopEvent(event: DragEvent | MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
