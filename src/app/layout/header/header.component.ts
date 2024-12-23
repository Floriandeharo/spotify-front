import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../service/auth.service';
import {Location} from "@angular/common";
import { User } from '../../service/model/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  authService = inject(AuthService);

  connectedUser: User = {email: this.authService.notConnected};

  location = inject(Location);

  environment = environment;
  consctructor() {
    effect(() => {
        if(this.authService.fetchUser().status == "OK"){
          this.connectedUser = this.authService.fetchUser().value!;
        }
      }
    )
  }

  ngOnInit(): void {
    this.authService.fetch();
  }


  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  goBackward(): void {
    this.location.back();
  }

  goForward(): void {
    this.location.forward();
  }


}
