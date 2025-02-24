import { Component, OnInit } from '@angular/core';
import { Category } from '../DTO/Category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../Services/category.service';
import { environment } from '../environments/environment';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];
  error: boolean = false;
  appVersion = environment.appVersion;
  apiVersion: string;
  apiGitHubRepo: string;

  constructor(
    private categorySvc: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private loginSvc: LoginService
  ) {}
  ngOnInit(): void {
    this.fetchApiVersion();
    this.categorySvc.getAllCategories().subscribe({
      next: (APIResult) => {
        if (APIResult.isSuccess) {
          this.categories = APIResult.data;
        }
      },
      error: (error) => {
        // Handle the error here
        if (error.status == 401) {
        }
        this.error = true;
      },
    });
  }

  fetchApiVersion(): void {
    this.loginSvc.getApiVersion().subscribe(
      (response) => {
        this.apiVersion = response.version;
        this.apiGitHubRepo = response.gitHubRepo;
      },
      (error) => {
        console.error('Error fetching API version', error);
        this.apiVersion = 'Unknown'; // Fallback in case of error
        this.apiGitHubRepo = ''; // Fallback for GitHub link
      }
    );
  }
}
