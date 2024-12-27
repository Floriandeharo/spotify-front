import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { LibraryComponent } from "./layout/library/library.component";
import { HeaderComponent } from './layout/header/header.component';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './service/toast.service';
import { ToastInfo } from './service/model/toast-info.model';
import { NgbModal, NgbModalRef, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { PlayerComponent } from './layout/player/player.component';
import { AuthPopupState, AuthService } from './service/auth.service';
import { AuthPopupComponent } from './layout/auth-popup/auth-popup.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgbToastModule,
    FontAwesomeModule,
    NavigationComponent,
    LibraryComponent,
    HeaderComponent,
    PlayerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'spotify-front';

  private faIconLibrary: FaIconLibrary = inject(FaIconLibrary);
  http = inject(HttpClient);
  toastService = inject(ToastService);
  private authService = inject(AuthService);

  private modalService: NgbModal = inject(NgbModal);

  private authModalRef: NgbModalRef | null = null;

  constructor(){
    effect(() => {
      this.openOrCloseAuthModal(this.authService.authPopupStateChange())
    }, {allowSignalWrites: true})
  }

  openOrCloseAuthModal(state: AuthPopupState) {
    if(state === "OPEN"){
      this.openAuthPopup();
    }else if(this.authModalRef !== null && state === "CLOSE" && this.modalService.hasOpenModals()){
      this.authModalRef.close();
    }
  }

  openAuthPopup() {
    this.authModalRef = this.modalService.open(AuthPopupComponent, {
      ariaDescribedBy: 'authentication-modal',
      centered: true,
    });

    this.authModalRef.dismissed.subscribe({
      next: () =>{
        this.authService.openOrCloseAuthPopup("CLOSE");
      }
    });

    this.authModalRef.closed.subscribe({
      next: () =>{
        this.authService.openOrCloseAuthPopup("CLOSE");
      }
    })
  }

  ngOnInit(): void {
    this.initFontAwesome();
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
