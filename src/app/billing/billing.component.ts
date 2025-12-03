import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  
  // Data Stores
  providers: any[] = [];
  services: any[] = [];
  capabilities: any[] = []; 
  
  // Dropdown options
  availableProviders: any[] = [];
  availableServices: any[] = [];

  // TABLE DATA
  billedEvents: any[] = []; // Only the current page of data
  totalItems: number = 0;
  
  // PAGINATION & SEARCH
  currentPage: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  private searchSubject = new Subject<string>(); // For debouncing

  // FORM INPUTS
  providerNameInput: string = '';
  serviceNameInput: string = '';

  currentEvent: any = {
    eventID: 0, 
    providerID: null,
    serviceID: null,
    dateOfService: '',
    billedAmount: 0
  };

  constructor(@Inject(ApiService) private api: ApiService) {
    // Setup Debounce: Wait 300ms after user stops typing to trigger search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchText = term;
      this.currentPage = 1; // Reset to page 1 on new search
      this.loadHistory();
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadHistory();
    this.resetForm();
  }

  loadData() {
    this.api.getProviders().subscribe(p => {
      this.providers = p;
      this.availableProviders = [...p];
      
      this.api.getServices().subscribe(s => {
        this.services = s;
        this.availableServices = [...s];

        this.api.getAllCapabilities().subscribe(c => {
          this.capabilities = c;
        });
      });
    });
  }

  loadHistory() {
    // Calls the SERVER-SIDE search endpoint
    this.api.searchBilledEvents(this.searchText, this.currentPage, this.pageSize)
      .subscribe((response: any) => {
        // Normalize IDs in the response
        this.billedEvents = response.data.map((e: any) => ({
          ...e,
          eventID: e.eventID || e.EventID,
          providerID: e.providerID || e.ProviderID,
          serviceID: e.serviceID || e.ServiceID,
          dateOfService: e.dateOfService || e.DateOfService,
          billedAmount: e.billedAmount || e.BilledAmount
        }));
        this.totalItems = response.totalCount;
      });
  }

  // Triggered by the HTML input
  onSearchInput(term: string) {
    this.searchSubject.next(term);
  }

  // Pagination Controls
  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadHistory();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // --- HELPERS ---
  getProviderName(id: number): string {
    const p = this.providers.find(x => x.providerID === id);
    return p ? `${p.firstName} ${p.lastName}` : 'Loading...';
  }

  getServiceName(id: number): string {
    const s = this.services.find(x => x.serviceID === id);
    return s ? s.serviceName : 'Loading...';
  }

  // --- DEPENDENT DROPDOWN LOGIC ---
  onProviderSelect() {
    const selectedP = this.providers.find(p => `${p.firstName} ${p.lastName}` === this.providerNameInput);
    if (selectedP) {
      this.currentEvent.providerID = selectedP.providerID;
      const allowedServiceIDs = this.capabilities
        .filter(c => (c.providerID || c.ProviderID) === selectedP.providerID)
        .map(c => c.serviceID || c.ServiceID);
      this.availableServices = this.services.filter(s => allowedServiceIDs.includes(s.serviceID));
    } else {
      this.currentEvent.providerID = null;
      this.availableServices = [...this.services]; 
    }
  }

  onServiceSelect() {
    const selectedS = this.services.find(s => s.serviceName === this.serviceNameInput);
    if (selectedS) {
      this.currentEvent.serviceID = selectedS.serviceID;
      this.currentEvent.billedAmount = selectedS.fee;
      const allowedProviderIDs = this.capabilities
        .filter(c => (c.serviceID || c.ServiceID) === selectedS.serviceID)
        .map(c => c.providerID || c.ProviderID);
      this.availableProviders = this.providers.filter(p => allowedProviderIDs.includes(p.providerID));
    } else {
      this.currentEvent.serviceID = null;
      this.currentEvent.billedAmount = 0;
      this.availableProviders = [...this.providers];
    }
  }

  editEvent(event: any) {
    this.currentEvent = { ...event };
    if(this.currentEvent.dateOfService) {
        this.currentEvent.dateOfService = this.currentEvent.dateOfService.split('T')[0];
    }
    this.providerNameInput = this.getProviderName(this.currentEvent.providerID);
    this.serviceNameInput = this.getServiceName(this.currentEvent.serviceID);
    this.onProviderSelect(); 
  }

  resetForm() {
    this.currentEvent = { 
        eventID: 0, providerID: null, serviceID: null, 
        dateOfService: new Date().toISOString().split('T')[0], billedAmount: 0 
    };
    this.providerNameInput = '';
    this.serviceNameInput = '';
    this.availableProviders = [...this.providers];
    this.availableServices = [...this.services];
  }

  saveEvent() {
    if (!this.currentEvent.providerID || !this.currentEvent.serviceID) {
      alert('Invalid Selection');
      return;
    }
    const obs = this.currentEvent.eventID === 0 
      ? this.api.logEvent(this.currentEvent) 
      : this.api.updateEvent(this.currentEvent.eventID, this.currentEvent);
      
    obs.subscribe(() => {
      this.loadHistory();
      this.resetForm();
    });
  }

  deleteEvent(id: number) {
    if(confirm('Void transaction?')) {
      this.api.deleteEvent(id).subscribe(() => this.loadHistory());
    }
  }
}