import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../environments/environment';
import { RouterLink, RouterModule } from '@angular/router';
import { SmallSongCardComponent } from '../../shared/small-song-card/small-song-card.component';
import { ReadSong } from '../../service/model/song.model';
import { SongService } from '../../service/song.service';
import { SongContentService } from '../../service/song-content.service';
@Component({
  selector: 'app-library',
  imports: [
    FontAwesomeModule,
    RouterModule,
    SmallSongCardComponent
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {

  private songService = inject(SongService);
  private songcontentService = inject(SongContentService);

  songs: Array<ReadSong> = [] ;

  isLoading = false;

  constructor(){
    effect(()=> {
      if(this.songService.getAllSig().status === "OK"){
        this.songs = this.songService.getAllSig().value!;
      }

      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs() {
    this.songService.getAll();
    this.isLoading = true;
  }

  onPlaySong(songToPlayFirst: ReadSong){
    this.songcontentService.createNewQueue(songToPlayFirst, this.songs!);
  }

}
