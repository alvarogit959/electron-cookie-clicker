import { TestBed } from '@angular/core/testing';
import { Scores } from './scores';

describe('ScoresMenu', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scores],
    }).compileComponents();
  });

  it('should create the ScoresMenu', () => {
    const fixture = TestBed.createComponent(Scores);
    const ScoresMenu = fixture.componentInstance;
    expect(ScoresMenu).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(Scores);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, electron-cookie-clicker');
  });
});
