import { Component, signal, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  protected readonly title = signal('electron-cookie-clicker');
//Botón click
  ngAfterViewInit(): void {
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
      }
    } catch (e) {
      console.error('Error registrando listener de update-display', e);
    }
  }
}