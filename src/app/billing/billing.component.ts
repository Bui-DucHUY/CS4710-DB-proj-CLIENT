import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  
  providers: any[] = [];
  services: any[] = [];
  billedEvents: any[] = [];
  filteredEvents: any[] = [];
  searchText: string = '';

  currentEvent: any = {
    eventID: 0, // 0 = New
    providerID: null,
    serviceID: null,
    dateOfService: '',
    billedAmount: 0
  };

  constructor(@Inject(ApiService) private api: ApiService) {}

  ngOnInit(): void {
    this.loadDropdowns();
    this.loadHistory();
    this.resetForm();
  }

  loadDropdowns() {
    this.api.getProviders().subscribe((data: any[]) => this.providers = data);
    this.api.getServices().subscribe((data: any[]) => this.services = data);
  }

  loadHistory() {
    this.api.getBilledEvents().subscribe((data: any[]) => {
      this.billedEvents = data;
      this.filterEvents();
    });
  }

  // --- HELPER FUNCTIONS FOR NAMES ---
  getProviderName(id: number): string {
    const p = this.providers.find(x => x.providerID === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Unknown';
  }

  getServiceName(id: number): string {
    const s = this.services.find(x => x.serviceID === id);
    return s ? s.serviceName : 'Unknown';
  }

  filterEvents() {
    if (!this.searchText) {
      this.filteredEvents = this.billedEvents;
    } else {
      const term = this.searchText.toLowerCase().trim();
      this.filteredEvents = this.billedEvents.filter(e => 
        (e.eventID || '').toString().includes(term) ||
        (e.billedAmount || 0).toString().includes(term) ||
        (e.dateOfService || '').toLowerCase().includes(term) ||
        this.getProviderName(e.providerID).toLowerCase().includes(term) || // Search by Provider Name!
        this.getServiceName(e.serviceID).toLowerCase().includes(term)      // Search by Service Name!
      );
    }
  }

  onServiceChange() {
    const selectedService = this.services.find(s => s.serviceID == this.currentEvent.serviceID);
    if (selectedService) {
      this.currentEvent.billedAmount = selectedService.fee;
    }
  }

  editEvent(event: any) {
    this.currentEvent = { ...event };
    // Ensure date is formatted for input[type="date"]
    if(this.currentEvent.dateOfService) {
        this.currentEvent.dateOfService = this.currentEvent.dateOfService.split('T')[0];
    }
  }

  resetForm() {
    this.currentEvent = { 
        eventID: 0, 
        providerID: null, 
        serviceID: null, 
        dateOfService: new Date().toISOString().split('T')[0], 
        billedAmount: 0 
    };
  }

  saveEvent() {
    if (!this.currentEvent.providerID || !this.currentEvent.serviceID) {
      alert('Select provider and service.');
      return;
    }

    if (this.currentEvent.eventID === 0) {
        this.api.logEvent(this.currentEvent).subscribe(() => {
            this.loadHistory();
            this.resetForm();
        });
    } else {
        this.api.updateEvent(this.currentEvent.eventID, this.currentEvent).subscribe(() => {
            this.loadHistory();
            this.resetForm();
        });
    }
  }

  deleteEvent(id: number) {
    if(confirm('Void this transaction?')) {
      this.api.deleteEvent(id).subscribe(() => this.loadHistory());
    }
  }
}