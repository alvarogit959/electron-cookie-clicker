import { Component, signal, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scores',
  standalone: true,
  templateUrl: './scores.html',
  styleUrls: ['./scores.css'],
})
export class ScoresComponent implements AfterViewInit, OnInit {

  protected readonly title = signal('Puntuaciones');

  constructor(private router: Router) {}

//Angular

  ngOnInit(): void {
    this.loadScores();
  }

  ngAfterViewInit(): void {

    const api = (window as any).electronAPI;

    console.log('Scores CARGADO');

//minimize
    document.getElementById('min-window')?.addEventListener('click', () => {
      api?.minimizeWindow();
    });

//Cerrar
    document.getElementById('close-window')?.addEventListener('click', () => {
      api?.closeWindow();
    });
  }


  goToHome() {
    this.router.navigate(['/home']);
  }


//TEST
  async loadScores() {

    try {
      const res = await fetch('http://localhost:5000/cookies');
      const scores = await res.json();

      const list = document.getElementById('scores-list');

      if (list) {

        list.innerHTML = '';

        scores.forEach((score: any, index: number) => {

          const div = document.createElement('div');
          div.textContent = `#${index + 1} - ${score.clicks} clicks`;

          list.appendChild(div);

        });

      }

    } catch (error) {
      console.error('Error cargando ranking', error);
    }

  }

}
