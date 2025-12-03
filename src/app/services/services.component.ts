import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  
  services: any[] = [];
  cptCodes: any[] = [];
  
  // PAGINATION & SEARCH
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  private searchSubject = new Subject<string>();

  newService = {
    serviceID: 0,
    serviceName: '',
    fee: 0,
    cptCode: ''
  };

  constructor(@Inject(ApiService) private api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchText = term;
      this.currentPage = 1;
      this.loadServices();
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadCptCodes();
  }

  loadServices() {
    this.api.searchServices(this.searchText, this.currentPage, this.pageSize)
      .subscribe((res: any) => {
        this.services = res.data;
        this.totalItems = res.totalCount;
      });
  }

  loadCptCodes() {
    this.api.getCptCodes().subscribe((data: any[]) => {
      this.cptCodes = data.map(c => ({
        cptCode: c.cptCode || c.CPTCode || c.cptcode, 
        descript: c.descript || c.Descript || 'No Description', 
        category: c.category || c.Category || 'General'
      }));
    });
  }

  onSearchInput(term: string) {
    this.searchSubject.next(term);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadServices();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  editService(service: any) {
    this.newService = { ...service };
  }

  resetForm() {
    this.newService = { serviceID: 0, serviceName: '', fee: 0, cptCode: '' };
  }

  saveService() {
    if (!this.newService.serviceName || !this.newService.cptCode) {
      alert('Name and CPT Code are required!');
      return;
    }

    if (this.newService.serviceID === 0) {
      this.api.addService(this.newService).subscribe(() => {
        this.loadServices();
        this.resetForm();
      });
    } else {
      this.api.updateService(this.newService.serviceID, this.newService).subscribe(() => {
        this.loadServices();
        this.resetForm();
      });
    }
  }

  deleteService(id: number) {
    if(confirm('Delete this service?')) {
      this.api.deleteService(id).subscribe(() => this.loadServices());
    }
  }
}