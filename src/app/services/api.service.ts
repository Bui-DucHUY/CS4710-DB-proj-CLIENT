import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- PROVIDERS ---
  getProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Providers`);
  }

  // NEW: Search Providers
  searchProviders(term: string, page: number, pageSize: number): Observable<any> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (term) params += `&term=${encodeURIComponent(term)}`;
    return this.http.get<any>(`${this.baseUrl}/Providers/search${params}`);
  }

  addProvider(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Providers`, data);
  }

  updateProvider(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Providers/${id}`, data);
  }

  deleteProvider(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Providers/${id}`);
  }

  // --- CAPABILITIES (New) ---
  getAllCapabilities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Providers/capabilities`);
  }

  updateProviderCapabilities(providerId: number, serviceIds: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/Providers/${providerId}/capabilities`, serviceIds);
  }

  // --- SERVICES ---
  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ClinicServices`);
  }

  // NEW: Search Services
  searchServices(term: string, page: number, pageSize: number): Observable<any> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (term) params += `&term=${encodeURIComponent(term)}`;
    return this.http.get<any>(`${this.baseUrl}/ClinicServices/search${params}`);
  }

  addService(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ClinicServices`, data);
  }

  updateService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ClinicServices/${id}`, data);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ClinicServices/${id}`);
  }

  // --- BILLING ---
  getBilledEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/BilledEvents`);
  }

  searchBilledEvents(term: string, page: number, pageSize: number): Observable<any> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (term) params += `&term=${encodeURIComponent(term)}`;
    return this.http.get<any>(`${this.baseUrl}/BilledEvents/search${params}`);
  }

  logEvent(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/BilledEvents`, data);
  }

  updateEvent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/BilledEvents/${id}`, data);
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/BilledEvents/${id}`);
  }

  // --- ANALYTICS ---
  getTrends(start: string, end: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Analytics/trends?startDate=${start}&endDate=${end}`);
  }

  getSuggestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Analytics/suggestions`);
  }

  getCptCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/CptCodes`);
  }
}