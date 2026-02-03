import { Component, signal, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  protected readonly title = signal('electron-cookie-clicker');
  platformId = inject(PLATFORM_ID);
//Botón click
  ngAfterViewInit(): void {
    //si no me da error ssr
    if (!isPlatformBrowser(this.platformId)) return;
    const btn = document.getElementById('click-button');
    if (btn) {
      btn.addEventListener('click', () => {
        try {
          (window as any).electronAPI.clickButton('button-clicked');
        } catch (e) {
          console.error('electronAPI not available', e);
        }
      });
    }
//Actualizar display contador
    try {
      const api = (window as any).electronAPI;
      if (api && typeof api.onMain === 'function') {
        api.onMain('update-display', (_event: any, message: string) => {
          const display = document.getElementById('display-text');
          if (display) display.textContent = message;
        });
        api.onMain('from-main', (_event: any, message: string) => {
          const timer = document.getElementById('timer-text');
          if (timer) (timer as HTMLElement).textContent = message;
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
    } catch (e) {
      console.error('Error registrando listener de update-display', e);
    }

    // Minimize window
    const minBtn = document.getElementById('min-window');
    if (minBtn) {
      minBtn.addEventListener('click', () => {
        try {
          (window as any).electronAPI.minimizeWindow();
        } catch (e) {
          console.error('Error minimizing window', e);
        }
      });
    }

    // Close window
    const closeBtn = document.getElementById('close-window');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        try {
          (window as any).electronAPI.closeWindow();
        } catch (e) {
          console.error('Error closing window', e);
        }
      });
    }
    //restart-button
    const restartBtn = document.getElementById('restart-button');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        try {
          (window as any).electronAPI.restartGame();
        } catch (e) {
          console.error('Error restart', e);
        }
      });
    }

    //puntuaciones-button
    const scoresBtn = document.getElementById('puntuaciones-button');
    if (scoresBtn) {
      scoresBtn.addEventListener('click', () => {
        try {
          (window as any).electronAPI.openScores();
        } catch (e) {
          console.error('Error abriendo scores', e);
        }
      });
    }

  }
}