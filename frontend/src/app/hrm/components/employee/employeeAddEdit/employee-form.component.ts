import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  // We must import all the PrimeNG form modules we want to use
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DropdownModule, ButtonModule, CheckboxModule],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  departments: any[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,              // Our custom service for making API calls
    public ref: DynamicDialogRef,       // Allows us to close the popup window
    public config: DynamicDialogConfig  // Allows us to receive data (if editing)
  ) {}

  ngOnInit() {
    // 1. Fetch departments from the API so we can populate the dropdown menu
    this.apiService.getAll('departments/').subscribe(data => this.departments = data);

    // 2. Build the empty form with rules (like Validators.required)
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      department_id: [null], 
      is_manager: [false],
      is_active: [true]
    });

    // 3. If data was passed into the popup, it means we are Editing!
    if (this.config.data && this.config.data.id) {
      this.isEditMode = true;
      // Magically fill the form boxes with the employee's existing data
      this.employeeForm.patchValue(this.config.data);
    }
  }

  save() {
    // Stop if they left a required box empty
    if (this.employeeForm.invalid) return; 

    const formData = this.employeeForm.value;

    if (this.isEditMode) {
      // Send PUT request to UPDATE
      this.apiService.update('employees/', this.config.data.id, formData).subscribe(() => {
        this.ref.close(true); // Close the popup and say "Success!"
      });
    } else {
      // Send POST request to CREATE
      this.apiService.create('employees/', formData).subscribe(() => {
        this.ref.close(true); // Close the popup and say "Success!"
      });
    }
  }

  cancel() {
    this.ref.close(false); // Close the popup without saving anything
  }
}
