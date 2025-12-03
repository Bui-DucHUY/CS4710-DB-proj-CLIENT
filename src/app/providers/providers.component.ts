import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent implements OnInit {
  
  providers: any[] = [];
  services: any[] = []; // Checkboxes
  selectedServiceIds: number[] = []; 
  
  // PAGINATION & SEARCH
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchText: string = '';
  private searchSubject = new Subject<string>();

  currentProvider: any = {
    providerID: 0,
    firstName: '',
    lastName: '',
    addrss: '',
    specialty: ''
  };

  constructor(@Inject(ApiService) private api: ApiService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchText = term;
      this.currentPage = 1; 
      this.loadProviders();
    });
  }

  ngOnInit(): void {
    this.loadProviders();
    this.loadServices();
  }

  loadProviders() {
    this.api.searchProviders(this.searchText, this.currentPage, this.pageSize)
      .subscribe((res: any) => {
        this.providers = res.data;
        this.totalItems = res.totalCount;
      });
  }

  loadServices() {
    this.api.getServices().subscribe((data: any[]) => {
      this.services = data.map(s => ({...s, serviceID: s.serviceID || s.ServiceID}));
    });
  }

  onSearchInput(term: string) {
    this.searchSubject.next(term);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadProviders();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  editProvider(provider: any) {
    this.currentProvider = { ...provider };
    
    // FETCH CAPABILITIES
    this.api.getAllCapabilities().subscribe((caps: any[]) => {
      this.selectedServiceIds = caps
        .filter(c => (c.providerID || c.ProviderID) === provider.providerID)
        .map(c => c.serviceID || c.ServiceID);
    });
  }

  toggleService(serviceId: number, event: any) {
    if (event.target.checked) {
      this.selectedServiceIds.push(serviceId);
    } else {
      this.selectedServiceIds = this.selectedServiceIds.filter(id => id !== serviceId);
    }
  }

  resetForm() {
    this.currentProvider = { providerID: 0, firstName: '', lastName: '', addrss: '', specialty: '' };
    this.selectedServiceIds = []; 
  }

  saveProvider() {
    if (!this.currentProvider.firstName || !this.currentProvider.lastName) {
      alert('Name is required!');
      return;
    }

    if (this.currentProvider.providerID === 0) {
      this.api.addProvider(this.currentProvider).subscribe((newProv: any) => {
        const newId = newProv.providerID || newProv.ProviderID;
        if(newId) {
            this.api.updateProviderCapabilities(newId, this.selectedServiceIds)
                .subscribe(() => { this.loadProviders(); this.resetForm(); });
        } else {
            this.loadProviders(); this.resetForm();
        }
      });
    } else {
      this.api.updateProvider(this.currentProvider.providerID, this.currentProvider).subscribe(() => {
          this.api.updateProviderCapabilities(this.currentProvider.providerID, this.selectedServiceIds)
              .subscribe(() => { this.loadProviders(); this.resetForm(); });
      });
    }
  }

  deleteProvider(id: number) {
    if(confirm('Delete this provider?')) {
      this.api.deleteProvider(id).subscribe(() => this.loadProviders());
    }
  }
}