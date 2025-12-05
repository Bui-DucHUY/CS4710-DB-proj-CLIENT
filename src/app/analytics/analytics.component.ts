import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  
  suggestions: any[] = [];
  
  startDate: string = '2024-01-01';
  endDate: string = '2024-12-31';

  public barChartType: 'bar' | 'line' = 'bar';

  public barChartData: ChartConfiguration<'bar' | 'line'>['data'] = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Revenue ($)', 
        backgroundColor: '#28a745', 
        yAxisID: 'y',
        order: 2
      },
      { 
        data: [], 
        label: 'Usage Count', 
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        type: 'line', 
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 4,
        order: 1
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',  // Hovering shows both values
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        },
        grid: {
          drawOnChartArea: false // Removes grid lines
        }
      }
    }
  };
  public barChartLegend = true;

  constructor(@Inject(ApiService) private api: ApiService) {}

  ngOnInit(): void {
    this.loadTrends();
    this.loadSuggestions();
  }

  loadTrends() {
    this.api.getTrends(this.startDate, this.endDate).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.barChartData.labels = data.map((item: any) => item.ServiceName || item.serviceName);
        
        this.barChartData.datasets[0].data = data.map((item: any) => item.TotalRevenue || item.totalRevenue);
        this.barChartData.datasets[1].data = data.map((item: any) => item.UsageCount || item.usageCount);

        this.barChartData = { ...this.barChartData };
      }
    });
  }

  loadSuggestions() {
    this.api.getSuggestions().subscribe((data: any[]) => {
      this.suggestions = data;
    });
  }
}