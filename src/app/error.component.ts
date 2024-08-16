import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-error',
  template: `
    <div class="row">
      <div class="col-md-6 mx-auto text-center mt-5">
        <!-- Bootstrap alert with a custom error message -->
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error!</h4>
          <!-- <p>Unauthorized</p> -->
          <p>
            Something went wrong while getting the data. Please contact your
            administrator
          </p>
          <p>
            Vedant Patel &nbsp;|&nbsp;<i class="fas fa-envelope"></i>
            vedantp9@gmail.com &nbsp;|&nbsp;<i class="fas fa-phone"></i> +1 647
            627 4235
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ErrorComponent {}
