import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LibraryComponent } from "./layout/library/library.component";
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './service/toast.service';
import { ToastInfo } from './service/model/toast-info.model';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgbToastModule,
    FontAwesomeModule,
    NavigationComponent,
    LibraryComponent,
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'spotify-front';

  private faIconLibrary: FaIconLibrary = inject(FaIconLibrary);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  ngOnInit(): void {
    this.initFontAwesome();
    this.toastService.show("Hello", "SUCCES");
  }


  // public test(){


  // this.http.get('/test').subscribe({
  //   next: (response) => console.log(response),
  //   error: (error) => console.error(error),
  // });
  // }

  private initFontAwesome(): void {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}
