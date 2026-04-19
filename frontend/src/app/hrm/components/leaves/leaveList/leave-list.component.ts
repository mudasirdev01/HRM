import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { LeaveFormComponent } from '../leaveAddEdit/leave-form.component';
import { ColumnDef, GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, ButtonModule],
  templateUrl: './leave-list.component.html',
  styleUrl: './leave-list.component.scss',
  providers: [DialogService]
})
export class LeaveListComponent implements OnInit {
  leaves: any[] = [];
  ref: DynamicDialogRef | undefined;

  leaveCols: ColumnDef[] = [
    { field: 'employee_name', header: 'Employee' },
    { field: 'start_date', header: 'Start Date' },
    { field: 'end_date', header: 'End Date' },
    { field: 'reason', header: 'Reason' },
    { field: 'status', header: 'Status' }
  ];

  constructor(private apiService: ApiService, public dialogService: DialogService) {}

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    // UPDATED: Now it points to leave-requests/
    this.apiService.getAll('leave-requests/').subscribe(data => this.leaves = data);
  }

  openNew() {
    this.ref = this.dialogService.open(LeaveFormComponent, {
      header: 'Request Leave', width: '40vw'
    });
    this.ref.onClose.subscribe(success => { if (success) this.loadLeaves(); });
  }

  handleEdit(leaveRow: any) {
    this.ref = this.dialogService.open(LeaveFormComponent, {
      header: 'Review Leave Request', width: '40vw',
      data: leaveRow
    });
    this.ref.onClose.subscribe(success => { if (success) this.loadLeaves(); });
  }
}
