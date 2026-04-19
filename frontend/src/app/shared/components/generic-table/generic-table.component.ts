import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../../core/services/api.service';


export interface ColumnDef {
  field: string;
  header: string;
  type?: 'text' | 'boolean' | 'badge';
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, TableModule, InputTextModule, TagModule, ButtonModule],
  templateUrl: './generic-table.component.html'
})
export class GenericTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnDef[] = [];
  @Input() title: string = 'Data Table';
  @Input() showActions: boolean = true; 
  
  // NEW: We pass the URL string (like 'employees/') so the table knows where to delete
  @Input() apiEndpoint: string = ''; 

  @Output() onEdit = new EventEmitter<any>();
  // NEW: This tells the parent to reload the list after the table deletes a row
  @Output() dataChanged = new EventEmitter<void>(); 

  globalFilterFields: string[] = [];

  // Inject the ApiService
  constructor(private apiService: ApiService ) {}

  ngOnInit() {
    this.globalFilterFields = this.columns.map(col => col.field);
  }

  editRow(row: any) {
    this.onEdit.emit(row);
  }

  // THE GENERIC DELETE FUNCTION
  deleteRow(row: any) {
    if (confirm('Are you sure you want to delete this record?')) {
      // The Generic Table makes the HTTP call itself!
      this.apiService.delete(this.apiEndpoint, row.id).subscribe({
        next: () => {
          // Tell the parent component to refresh the screen
          this.dataChanged.emit();
        },
        // error: (err) => console.error('Error deleting record', err)
      });
    }
  }
}
