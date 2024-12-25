import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-library',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
environment = environment;
}
