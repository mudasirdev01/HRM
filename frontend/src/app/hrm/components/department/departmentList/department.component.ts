import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { DepartmentFormComponent } from '../departmentAddEdit/department-form.component';
import { ColumnDef, GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';

// Import Dialog tools and the new form
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ButtonModule],
  templateUrl: './department.component.html',
  providers: [DialogService] // Required for popups
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];
  ref: DynamicDialogRef | undefined;

  departmentCols: ColumnDef[] = [
    { field: 'name', header: 'Department Name' },
    { field: 'description', header: 'Description' }
  ];

  constructor(
    private apiService: ApiService,
    public dialogService: DialogService // Inject here
  ) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.apiService.getAll('departments/').subscribe(data => this.departments = data);
  }

  openNew() {
    this.ref = this.dialogService.open(DepartmentFormComponent, {
      header: 'Add New Department', width: '40vw'
    });
    this.ref.onClose.subscribe(success => { if (success) this.loadDepartments(); });
  }

  handleEdit(deptRow: any) {
    this.ref = this.dialogService.open(DepartmentFormComponent, {
      header: 'Edit Department', width: '40vw',
      data: deptRow
    });
    this.ref.onClose.subscribe(success => { if (success) this.loadDepartments(); });
  }
}
