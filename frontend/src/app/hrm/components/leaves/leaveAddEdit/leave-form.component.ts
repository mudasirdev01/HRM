import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar'; // For picking dates!
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, DropdownModule, ButtonModule, InputTextareaModule, CalendarModule],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss'
})


export class LeaveFormComponent implements OnInit {
  leaveForm!: FormGroup;
  employees: any[] = [];
  isEditMode = false;
  // The choices for the status dropdown
  statusChoices = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }
  ngOnInit() {
    // Fetch all employees for the dropdown
    this.apiService.getAll('employees/').subscribe(data => this.employees = data);
    // Build the form
    this.leaveForm = this.fb.group({
      employee_id: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      reason: ['', Validators.required],
      status: ['PENDING'] // Default to pending
    });
    // If editing an existing request, patch the data
    if (this.config.data && this.config.data.id) {
      this.isEditMode = true;

      // We must convert the date strings back into Javascript Date objects for PrimeNG Calendar
      const formData = { ...this.config.data };
      if (formData.start_date) formData.start_date = new Date(formData.start_date);
      if (formData.end_date) formData.end_date = new Date(formData.end_date);

      this.leaveForm.patchValue(formData);
    }
  }
  save() {
    if (this.leaveForm.invalid) return;

    const rawData = this.leaveForm.value;
    const payload = {
      ...rawData,
      start_date: rawData.start_date.toISOString().split('T')[0],
      end_date: rawData.end_date.toISOString().split('T')[0]
    };

    if (this.isEditMode) {
      // FIX THIS LINE: Change to 'leave-requests/'
      this.apiService.update('leave-requests/', this.config.data.id, payload).subscribe(() => this.ref.close(true));
    } else {
      // FIX THIS LINE: Change to 'leave-requests/'
      this.apiService.create('leave-requests/', payload).subscribe(() => this.ref.close(true));
    }
  }
  cancel() {
    this.ref.close(false);
  }
}