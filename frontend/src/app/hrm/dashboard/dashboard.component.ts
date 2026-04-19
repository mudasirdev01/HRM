import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { forkJoin } from 'rxjs';

import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { GenericTableComponent, ColumnDef } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, TabViewModule, GenericTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalEmployees: number = 0;
  totalDepartments: number = 0;
  pendingLeaves: number = 0;

  employeesData: any[] = [];
  departmentsData: any[] = [];
  leavesData: any[] = [];

  employeeCols: ColumnDef[] = [
    { field: 'first_name', header: 'First Name' },
    { field: 'last_name', header: 'Last Name' },
    { field: 'department_name', header: 'Department' },
    { field: 'is_active', header: 'Active Status', type: 'badge' }
  ];

  departmentCols: ColumnDef[] = [
    { field: 'name', header: 'Department Name' },
    { field: 'description', header: 'Description' }
  ];

  leaveCols: ColumnDef[] = [
    { field: 'employee_name', header: 'Employee' },
    { field: 'start_date', header: 'Start Date' },
    { field: 'end_date', header: 'End Date' },
    { field: 'status', header: 'Status' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    forkJoin({
      employees: this.apiService.getAll('employees/'),
      departments: this.apiService.getAll('departments/'),
      leaves: this.apiService.getAll('leave-requests/')
    }).subscribe(({ employees, departments, leaves }) => {
      this.employeesData = employees;
      this.departmentsData = departments;
      this.leavesData = leaves;

      this.totalEmployees = employees.length;
      this.totalDepartments = departments.length;
      this.pendingLeaves = leaves.filter((l: any) => l.status === 'PENDING').length;
    });
  }
}
