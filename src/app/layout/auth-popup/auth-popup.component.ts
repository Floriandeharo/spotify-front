import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth-popup',
  imports: [],
  templateUrl: './auth-popup.component.html',
  styleUrl: './auth-popup.component.scss'
})
export class AuthPopupComponent {

  private authService = inject(AuthService);

  login(){
    this.authService.login();
  }
}
