import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-scores',
  standalone: true,
  templateUrl: './scores.html',
  styleUrls: ['./scores.css']
})
export class ScoresComponent implements AfterViewInit {
  protected readonly title = signal('Puntuaciones');

//Botón click
  ngAfterViewInit(): void {
    console.log('Scores CARGADO');
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
          (window as any).electronAPI.closeScoresWindow();
        } catch (e) {
          console.error('Error cerrando la ventana', e);
        }
      });
    }
  }
}