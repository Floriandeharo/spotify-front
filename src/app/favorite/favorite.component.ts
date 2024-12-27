import { Component, effect, inject, OnInit } from '@angular/core';
import { FavoriteSongBtnComponent } from '../shared/favorite-song-btn/favorite-song-btn.component';
import { SmallSongCardComponent } from '../shared/small-song-card/small-song-card.component';
import { ReadSong } from '../service/model/song.model';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';

@Component({
  selector: 'app-favorite',
  imports: [
    FavoriteSongBtnComponent,
    SmallSongCardComponent
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  favoriteSongs: Array<ReadSong> = [];

  songService = inject(SongService);

  songContentService = inject(SongContentService);


  constructor() {
    effect(() =>{
      let addOrRemoveFavoriteSongSig = this.songService.addOrRemoveFavoriteSongSig();
      if(addOrRemoveFavoriteSongSig.status === "OK"){
        this.songService.fetchFavorite();
      }
    })

    effect(() => {
      let favoriteSongsSig = this.songService.fetchFavoriteSongSig();
      if(favoriteSongsSig.status === "OK"){
        favoriteSongsSig.value?.forEach((song: ReadSong) => {song.favorite = true});
        this.favoriteSongs = favoriteSongsSig.value!;
      }
    })
  }

  ngOnInit(): void {
    this.songService.fetchFavorite();
  }

  onPlay(firstSong: ReadSong){
    this.songContentService.createNewQueue(firstSong, this.favoriteSongs);
  }

}
