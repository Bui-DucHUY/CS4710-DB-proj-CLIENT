import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  
  services: any[] = [];
  filteredServices: any[] = [];
  cptCodes: any[] = [];
  searchText: string = '';

  // Form Model
  currentService: any = {
    serviceID: 0, // 0 = New
    serviceName: '',
    fee: 0,
    cptCode: ''
  };

  constructor(@Inject(ApiService) private api: ApiService) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadCptCodes();
  }

  loadServices() {
    this.api.getServices().subscribe((data: any[]) => {
      this.services = data;
      this.filterServices();
    });
  }

  loadCptCodes() {
    this.api.getCptCodes().subscribe((data: any[]) => this.cptCodes = data);
  }

  filterServices() {
    if (!this.searchText) {
      this.filteredServices = this.services;
    } else {
      const term = this.searchText.toLowerCase().trim();
      this.filteredServices = this.services.filter(s => 
        (s.serviceName || '').toLowerCase().includes(term) || 
        (s.cptCode || '').toLowerCase().includes(term) ||
        (s.fee || 0).toString().includes(term)
      );
    }
  }

  editService(service: any) {
    this.currentService = { ...service };
  }

  resetForm() {
    this.currentService = { serviceID: 0, serviceName: '', fee: 0, cptCode: '' };
  }

  saveService() {
    if (!this.currentService.serviceName || !this.currentService.cptCode) {
      alert('Name and CPT Code are required!');
      return;
    }

    if (this.currentService.serviceID === 0) {
      this.api.addService(this.currentService).subscribe(() => {
        this.loadServices();
        this.resetForm();
      });
    } else {
      this.api.updateService(this.currentService.serviceID, this.currentService).subscribe(() => {
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