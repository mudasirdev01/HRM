import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';


// 1. Import the PrimeNG Dialog tools
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

// 2. Import your specific Form Component!
import { EmployeeFormComponent } from '../employeeAddEdit/employee-form.component';

// 3. Import Button module for the 'Add New' button
import { ButtonModule } from 'primeng/button'; 
import { ColumnDef, GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ButtonModule], 
  templateUrl: './employee.component.html',
  // IMPORTANT: You MUST provide the DialogService here for popups to work
  providers: [DialogService] 
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  
  // This variable keeps track of the popup window so we know when it closes
  ref: DynamicDialogRef | undefined; 

  employeeCols: ColumnDef[] = [
    { field: 'first_name', header: 'First Name' },
    { field: 'last_name', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'department_name', header: 'Department' },
    { field: 'is_active', header: 'Active Status', type: 'badge' }
  ];

  // Inject the DialogService into the constructor
  constructor(
    private apiService: ApiService,
    public dialogService: DialogService 
  ) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.apiService.getAll('employees').subscribe(data => this.employees = data);
  }

  // --- NEW: Function to ADD a new employee ---
  openNew() {
    this.ref = this.dialogService.open(EmployeeFormComponent, {
      header: 'Add New Employee',
      width: '70vw',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000
    });

    // When the user clicks 'Save' and the popup closes, refresh the table
    this.ref.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadEmployees();
      }
    });
  }

  // --- UPDATED: Function to EDIT an existing employee ---
  handleEdit(employeeRow: any) {
    this.ref = this.dialogService.open(EmployeeFormComponent, {
      header: 'Edit Employee',
      width: '50vw',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: employeeRow // Pass the employee's existing data into the popup!
    });

    // When the user clicks 'Save' and the popup closes, refresh the table
    this.ref.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadEmployees();
      }
    });
  }
}
