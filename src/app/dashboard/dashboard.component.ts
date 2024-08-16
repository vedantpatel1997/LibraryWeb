import { Component, OnInit } from '@angular/core';
import { Category } from '../DTO/Category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../Services/category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];
  error: boolean = false;

  constructor(
    private categorySvc: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
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
}
