import { Component, signal, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements AfterViewInit {
  protected readonly title = signal('electron-cookie-clicker');
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const electronAPI = (window as any).electronAPI;

    // Botón CLICK
    const btn = document.getElementById('click-button');
    if (btn) {
      btn.addEventListener('click', () => {
        try {
          electronAPI.clickButton('button-clicked');
        } catch (e) {
          console.error('electronAPI not available', e);
        }
      });
    }

    if (electronAPI && typeof electronAPI.onMain === 'function') {
      electronAPI.onMain('update-display', (_event: any, message: string) => {
        const display = document.getElementById('display-text');
        if (display) display.textContent = message;
      });

      electronAPI.onMain('from-main', (_event: any, message: string) => {
        const timer = document.getElementById('timer-text');
        if (timer) (timer as HTMLElement).textContent = message;
      });

      electronAPI.onMain('disable-button', () => {
        const clickBtn = document.getElementById('click-button') as HTMLButtonElement | null;
        if (clickBtn) clickBtn.disabled = true;
      });

      electronAPI.onMain('enable-button', () => {
        const clickBtn = document.getElementById('click-button') as HTMLButtonElement | null;
        if (clickBtn) clickBtn.disabled = false;
      });
    }

//MIN
    const minBtn = document.getElementById('min-window');
    if (minBtn) {
      minBtn.addEventListener('click', () => {
        try {
          electronAPI.minimizeWindow();
        } catch (e) {
          console.error('Error minimizing window', e);
        }
      });
    }

//CERRAR
    const closeBtn = document.getElementById('close-window');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        try {
          electronAPI.closeWindow();
        } catch (e) {
          console.error('Error closing window', e);
        }
      });
    }

//Restart
    const restartBtn = document.getElementById('restart-button');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        try {
          electronAPI.restartGame();
        } catch (e) {
          console.error('Error restart', e);
        }
      });
    }

//Scores
    const scoresBtn = document.getElementById('puntuaciones-button');
    if (scoresBtn) {
      scoresBtn.addEventListener('click', () => {
        try {
          this.router.navigate(['/scores']);
        } catch (e) {
          console.error('Error navegando a scores', e);
        }
      });
    }
  }
}
