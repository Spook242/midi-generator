import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Home } from './home';
import { provideRouter } from '@angular/router';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería enlazar Sign up con /signup', () => {
    const signupLink = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .find((element) => element.nativeElement.textContent.trim() === 'Sign up');

    expect(signupLink).toBeTruthy();
    expect(signupLink!.attributes['routerLink']).toBe('/signup');
  });
});
