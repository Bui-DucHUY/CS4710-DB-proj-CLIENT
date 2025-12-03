import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngStyle

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  
  // Default color (Dashboard gradient)
  navbarStyle: string = 'linear-gradient(to right, #0d6efd, #0dcaf0, #198754)';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateNavbarColor(event.urlAfterRedirects);
    });
  }

  updateNavbarColor(url: string) {
    if (url.includes('/providers')) {
      this.navbarStyle = '#0d6efd'; // Bootstrap Primary (Blue)
    } else if (url.includes('/services')) {
      this.navbarStyle = '#0dcaf0'; // Bootstrap Info (Light Blue)
    } else if (url.includes('/billing')) {
      this.navbarStyle = '#198754'; // Bootstrap Success (Green)
    } else if (url.includes('/analytics')) {
      this.navbarStyle = 'linear-gradient(to right, #5C44E4, #F736E3, #E90464)';
    } else {
      // Dashboard or Default
      this.navbarStyle = 'linear-gradient(to right, #0d6efd, #0dcaf0, #198754)';
    }
  }
}