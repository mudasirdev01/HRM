import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea'; // For the description box

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, InputTextareaModule],
  templateUrl: './department-form.component.html'
})
export class DepartmentFormComponent implements OnInit {
  departmentForm!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    // Build the simple form
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    // If Editing, fill the boxes
    if (this.config.data && this.config.data.id) {
      this.isEditMode = true;
      this.departmentForm.patchValue(this.config.data);
    }
  }

  save() {
    if (this.departmentForm.invalid) return; 

    const formData = this.departmentForm.value;

    if (this.isEditMode) {
      this.apiService.update('departments/', this.config.data.id, formData).subscribe(() => {
        this.ref.close(true);
      });
    } else {
      this.apiService.create('departments/', formData).subscribe(() => {
        this.ref.close(true);
      });
    }
  }

  cancel() {
    this.ref.close(false);
  }
}
