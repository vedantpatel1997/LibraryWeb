import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="row mt-5">
      <div class="col-md-6 offset-md-3 text-center">
        <!-- Bootstrap alert with a custom error message -->
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Page Not Found</h4>
          <p>The page you are looking for does not exist.</p>
          <a [routerLink]="['/']" class="btn btn-primary">Go to Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    /* Custom styles can be added here */
    `
      body {
        background-color: #f8f9fa;
      }
      .container {
        margin-top: 100px;
      }
    `,
  ],
})
export class PageNotFoundComponent {}
