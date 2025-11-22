import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../shared/safe-url.pipe';
import { VideoService } from '../services/video.service';

@Component({
  standalone: true,
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  imports: [CommonModule, SafeUrlPipe],
})
export class VideosComponent implements OnInit {

  coursId!: number;
  videos: any[] = [];
  loading = true;
  refreshing = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.coursId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVideos();
  }

  loadVideos() {
    this.loading = true;

    this.videoService.getVideos(this.coursId).subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;
      },
      error: () => {
        alert("❌ Impossible de charger les vidéos");
        this.loading = false;
      }
    });
  }

  rafraichir() {
    this.refreshing = true;

    this.videoService.refreshVideos(this.coursId).subscribe({
      next: (data) => {
        this.videos = data;
        this.refreshing = false;
        alert("✨ Nouvelles vidéos générées !");
      },
      error: () => {
        alert("❌ Erreur lors du rafraîchissement");
        this.refreshing = false;
      }
    });
  }
}
