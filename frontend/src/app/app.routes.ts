import { Routes } from '@angular/router';
import { DepartmentComponent } from './hrm/components/department/departmentList/department.component';
import { EmployeeComponent } from './hrm/components/employee/employeeList/employee.component';
import { LeaveListComponent } from './hrm/components/leaves/leaveList/leave-list.component';
import { DashboardComponent } from './hrm/dashboard/dashboard.component';


export const routes: Routes = [
    {
        path : '',
        component: DashboardComponent,
        pathMatch: 'full'
    },
    {
        path: 'departments',
        component: DepartmentComponent
    },
    {
        path: 'employees', 
        component: EmployeeComponent
    },
    {
        path: 'leaves', 
        component: LeaveListComponent
    }
];
