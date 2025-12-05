import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  totalProviders: number = 0;
  totalServices: number = 0;
  totalRevenue: number = 0;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue ($)',
        fill: true,
        tension: 0.5,
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13, 110, 253, 0.1)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartLegend = true;

  constructor(@Inject(ApiService) private api: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTrends();
  }

  loadStats() {
    this.api.getProviders().subscribe((data: any[]) => this.totalProviders = data.length);
    this.api.getServices().subscribe((data: any[]) => this.totalServices = data.length);

    this.api.getBilledEvents().subscribe((data: any[]) => {
      this.totalRevenue = data.reduce((sum: number, item: any) => 
        sum + (item.BilledAmount || item.billedAmount || 0), 0);
    });
  }

  loadTrends() {
    const start = '2024-01-01';
    const end = '2024-12-31';

    this.api.getTrends(start, end).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.lineChartData.labels = data.map((item: any) => item.ServiceName || item.serviceName);
        
        this.lineChartData.datasets[0].data = data.map((item: any) => item.TotalRevenue || item.totalRevenue);
        
        // Trigger update
        this.lineChartData = { ...this.lineChartData };
      }
    });
  }
}