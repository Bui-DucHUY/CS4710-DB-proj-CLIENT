import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css'
})
export class ProvidersComponent implements OnInit {
  
  providers: any[] = [];
  filteredProviders: any[] = [];
  searchText: string = '';

  currentProvider: any = {
    providerID: 0,
    firstName: '',
    lastName: '',
    addrss: '',
    specialty: ''
  };

  constructor(@Inject(ApiService) private api: ApiService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders() {
    this.api.getProviders().subscribe((data: any[]) => {
      this.providers = data;
      this.filterProviders(); // Initial filter to show all
    });
  }

  // FIXED SEARCH LOGIC
  filterProviders() {
    if (!this.searchText) {
      this.filteredProviders = this.providers;
    } else {
      const term = this.searchText.toLowerCase().trim(); // Trim whitespace
      
      this.filteredProviders = this.providers.filter(p => 
        (p.firstName && p.firstName.toLowerCase().includes(term)) || 
        (p.lastName && p.lastName.toLowerCase().includes(term)) ||
        (p.specialty && p.specialty.toLowerCase().includes(term)) || // Check for null!
        (p.addrss && p.addrss.toLowerCase().includes(term))          // Search address too
      );
    }
  }

  editProvider(provider: any) {
    this.currentProvider = { ...provider };
  }

  resetForm() {
    this.currentProvider = { providerID: 0, firstName: '', lastName: '', addrss: '', specialty: '' };
  }

  saveProvider() {
    if (!this.currentProvider.firstName || !this.currentProvider.lastName) {
      alert('Name is required!');
      return;
    }

    if (this.currentProvider.providerID === 0) {
      this.api.addProvider(this.currentProvider).subscribe(() => {
        this.loadProviders();
        this.resetForm();
      });
    } else {
      this.api.updateProvider(this.currentProvider.providerID, this.currentProvider).subscribe(() => {
        this.loadProviders();
        this.resetForm();
      });
    }
  }

  deleteProvider(id: number) {
    if(confirm('Delete this provider?')) {
      this.api.deleteProvider(id).subscribe(() => {
        this.loadProviders();
      });
    }
  }
}