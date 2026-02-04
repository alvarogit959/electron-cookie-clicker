import { Component, signal, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements AfterViewInit {
  protected readonly title = signal('electron-cookie-clicker');
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  goToScores() {
    console.log('Navigating to Scores...');
    this.router.navigate(['/scores']);
  }

  ngAfterViewInit(): void {
    // Solo ejecutar en navegador
    if (!isPlatformBrowser(this.platformId)) return;

    const api = (window as any).electronAPI;

    // Click button
    document.getElementById('click-button')?.addEventListener('click', () => {
      console.log('CLICK button pressed');
      api?.clickButton('button-clicked');
    });

    // Scores button → abrir ventana de Scores en Electron
    const scoresBtn = document.getElementById('puntuaciones-button');
    scoresBtn?.addEventListener('click', () => {
      console.log('Scores button pressed');
      this.router.navigate(['/scores']);
    });

    // Minimize window
    document.getElementById('min-window')?.addEventListener('click', () => {
      api?.minimizeWindow();
    });

    // Close window
    document.getElementById('close-window')?.addEventListener('click', () => {
      api?.closeWindow();
    });

    // Restart game
    document.getElementById('restart-button')?.addEventListener('click', () => {
      api?.restartGame();
    });

    // Listeners desde main process
    if (api && typeof api.onMain === 'function') {
      api.onMain('update-display', (_e: any, msg: string) => {
        const display = document.getElementById('display-text');
        if (display) display.textContent = msg;
      });

      api.onMain('from-main', (_e: any, msg: string) => {
        const timer = document.getElementById('timer-text');
        if (timer) timer.textContent = msg;
      });

      api.onMain('disable-button', () => {
        const btn = document.getElementById('click-button') as HTMLButtonElement | null;
        if (btn) btn.disabled = true;
      });

      api.onMain('enable-button', () => {
        const btn = document.getElementById('click-button') as HTMLButtonElement | null;
        if (btn) btn.disabled = false;
      });
    }
  }
}
