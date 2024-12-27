import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ReadSong, SaveSong } from './model/song.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';
import { catchError, map, of } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  http: HttpClient = inject(HttpClient);
  toastService = inject(ToastService);

  private add$: WritableSignal<State<SaveSong, HttpErrorResponse>> = signal(State.Builder<SaveSong, HttpErrorResponse>().forInit().build());
  addSig = computed(() => this.add$());

  private getAll$: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>> =
    signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build());
  getAllSig = computed(() => this.getAll$());

  private addOrRemoveFavoriteSong$: WritableSignal<State<ReadSong, HttpErrorResponse>>  =
  signal(State.Builder<ReadSong, HttpErrorResponse>().forInit().build());
  addOrRemoveFavoriteSongSig = computed(() => this.addOrRemoveFavoriteSong$());

  private fetchFavoriteSong$: WritableSignal<State<Array<ReadSong>, HttpErrorResponse>>  =
  signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit().build());
  fetchFavoriteSongSig = computed(() => this.fetchFavoriteSong$());

  getAll(): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs`)
      .subscribe({
        next: songs => this.getAll$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(songs).build()),
        error: err => this.getAll$.set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build())
      })
    }


  add(song: SaveSong): void {
    const formData = new FormData();
    formData.append('cover', song.cover!);
    formData.append('file', song.file!);
    const clone = structuredClone(song);
    clone.file = undefined;
    clone.cover = undefined;
    formData.append('dto', JSON.stringify(clone));
    this.http.post<SaveSong>(`${environment.API_URL}/api/songs`,formData)
      .subscribe({
        next: savedSong => this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forSuccess(savedSong).build()),
        error: (err: HttpErrorResponse) => this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forError(err).build())
      })
  }

  reset(): void {
    this.add$.set(State.Builder<SaveSong, HttpErrorResponse>().forInit().build());
  }

  search(newSearchTerm: string){
    const queryParams = new HttpParams().set('term', newSearchTerm);
    return this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs/search`, {params: queryParams})
      .pipe(
        map(songs =>State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(songs).build()),
        catchError(err => of(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build()))
      )
  }

  addOrRemoveAsFavorite(favorite: boolean, publicId: string){
    this.http.post<ReadSong>(`${environment.API_URL}/api/songs/like`, {favorite, publicId})
    .subscribe({
      next: updatedSong => {
        this.addOrRemoveFavoriteSong$.set(State.Builder<ReadSong, HttpErrorResponse>().forSuccess(updatedSong).build());
        if(updatedSong.favorite){
          this.toastService.show("Song added to favorites", "SUCCESS");
        }else{
          this.toastService.show("Song removed from favorites", "SUCCESS");
        }
      },
      error: err => {
        this.addOrRemoveFavoriteSong$.set(State.Builder<ReadSong, HttpErrorResponse>().forError(err).build());
        this.toastService.show("Error adding/removing song from favorites", "DANGER");
      }
    })
  }

  fetchFavorite(){
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/api/songs/like`)
    .subscribe({
      next: favoritesSongs => this.fetchFavoriteSong$
          .set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forSuccess(favoritesSongs).build()),
      error: err => this.fetchFavoriteSong$
          .set(State.Builder<Array<ReadSong>, HttpErrorResponse>().forError(err).build())
    })
  }



  constructor() { }
}
