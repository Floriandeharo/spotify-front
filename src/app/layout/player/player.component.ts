import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SmallSongCardComponent } from '../../shared/small-song-card/small-song-card.component';
import { Howl } from 'howler';
import { SongContentService } from '../../service/song-content.service';
import { ReadSong, SongContent } from '../../service/model/song.model';
import { FavoriteSongBtnComponent } from '../../shared/favorite-song-btn/favorite-song-btn.component';

@Component({
  selector: 'app-player',
  imports: [
    FontAwesomeModule,
    FormsModule,
    FavoriteSongBtnComponent,
    SmallSongCardComponent
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {

  songContentService: SongContentService = inject(SongContentService);

  public currentSong: SongContent | undefined = undefined;
  currentHowlInstance: Howl | undefined ;

  isPlaying = false;
  currentVolume = 0.5;

  isMuted = false;

  private nextQueue: Array<SongContent> = [];
  private previousQueue: Array<SongContent> = [];

  constructor() {
    effect(() => {
      const newQueue = this.songContentService.queueToPlay();
      if(newQueue.length > 0){
        this.onNewQueue(newQueue);
      }
    })

    effect(()=> {
      if(this.songContentService.playNewSong().status === "OK"){
        this.onNextSong()
      }
    })
  }
  onNewQueue(newQueue: Array<ReadSong>) {
    this.nextQueue = newQueue;
    this.playNextSongInQueue();
  }

  playNextSongInQueue() {
    if(this.nextQueue.length > 0){
    this.isPlaying = false;
    if (this.currentSong) {
      this.previousQueue.unshift(this.currentSong);
    }
    const nextSong = this.nextQueue.shift();
    this.songContentService.fetchNextSong(nextSong!);
    }
  }

  onNextSong() {
    this.currentSong = this.songContentService.playNewSong().value!;
    console.log(`data:${this.currentSong.fileContentType};base64,${this.currentSong.file}`)
    const newHowlInstance = new Howl({
      src: [`data:${this.currentSong.fileContentType};base64,${this.currentSong.file}`],
      format: ['mp3'],
      volume: this.currentVolume,
      onplay: () => this.onPlay(),
      onpause: () => this.onPause(),
      onend: () => this.onEnd(),

    })

    if(this.currentHowlInstance){
      this.currentHowlInstance.stop();
    }

    newHowlInstance.play();
    this.currentHowlInstance = newHowlInstance;
  }

  onPlay(): void {
    this.isPlaying = true;
  }
  onPause(): void {
    this.isPlaying = false;
  }
  onEnd(): void {
    this.playNextSongInQueue();
    this.isPlaying = false;
  }

  onForward(): void {
    this.playNextSongInQueue();
  }

  onBackward(): void {
  if(this.previousQueue.length > 0){
    this.isPlaying = false;
    if(this.currentSong){
      this.nextQueue.unshift(this.currentSong!);
    }
    const previousSong = this.previousQueue.shift();
    this.songContentService.fetchNextSong(previousSong!);
  }
}

pause(){
  if(this.currentHowlInstance){
    this.currentHowlInstance.pause();
  }
}

play(){
  if(this.currentHowlInstance){
    this.currentHowlInstance.play();
  }
}

onMute(){
  if(this.currentHowlInstance){
    this.isMuted = !this.isMuted;
    this.currentHowlInstance.mute(this.isMuted);
    if(this.isMuted){
      this.currentVolume = 0;
    }else{
      this.currentVolume = 0.5
      this.currentHowlInstance.volume(this.currentVolume);
    }
  }
}

onVolumeChange(newVolume: number){
  this.currentVolume  = newVolume / 100;
  if(this.currentHowlInstance){
    this.currentHowlInstance.volume(this.currentVolume);
    if(this.currentVolume === 0){
      this.isMuted = true;
      this.currentHowlInstance.mute(this.isMuted);
    } else if(this.isMuted){
      this.isMuted = false;
      this.currentHowlInstance.mute(this.isMuted);
    }
  }
}
}
