import { Component, signal, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-scores',
  standalone: true,
  templateUrl: './scores.html',
  styleUrls: ['./scores.css'],
})
export class ScoresComponent implements AfterViewInit {
  protected readonly title = signal('Puntuaciones');

  constructor(private router: Router) {}
  goToHome() {
    console.log('Volviendo a home test');
    this.router.navigate(['/home']);
  }
  //Botón click
  ngAfterViewInit(): void {

    const api = (window as any).electronAPI;




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
    //RETURN
    const returnBtn = document.getElementById('return-button');
    returnBtn?.addEventListener('click', () => {
      console.log('return pressedd');
      this.router.navigate(['/home']);
    });
    // Minimize window
    document.getElementById('min-window')?.addEventListener('click', () => {
      api?.minimizeWindow();
    });

    // Close window
    document.getElementById('close-window')?.addEventListener('click', () => {
      api?.closeWindow();
    });
  }
}
