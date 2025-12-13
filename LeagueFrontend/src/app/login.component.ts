import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service'; // <--- Importar servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      <a routerLink="/" class="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-500 hover:text-[#388e14] transition-colors group z-10">
        <span class="text-sm font-medium">Volver al inicio</span>
      </a>

      <div class="w-full max-w-[420px] p-10 border border-gray-100 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white mb-8 relative z-0">
         <div class="text-center mb-8">
           <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Iniciar Sesión</h1>
           <p class="text-gray-500 text-sm font-normal">Bienvenido de nuevo a Liga Gremio Laboral.</p>
         </div>

         <form class="space-y-6" (ngSubmit)="onSubmit($event)">
           <div class="space-y-1.5">
             <label for="username" class="block text-sm font-medium text-gray-800">Correo Electrónico</label>
             <input id="username" name="username" type="text" [ngModel]="username()" (ngModelChange)="username.set($event)" placeholder="admin@liga.com" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] transition-all text-sm placeholder-gray-400 bg-white text-gray-900">
           </div>

           <div class="space-y-1.5">
             <label for="password" class="block text-sm font-medium text-gray-800">Contraseña</label>
             <input id="password" name="password" type="password" [ngModel]="password()" (ngModelChange)="password.set($event)" placeholder="********" class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] transition-all text-sm placeholder-gray-400 bg-white text-gray-900">
           </div>

           <button type="submit" [disabled]="isLoading()" class="w-full bg-[#388e14] hover:bg-[#2e7510] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm text-sm mt-2 flex justify-center items-center">
             {{ isLoading() ? 'Verificando...' : 'Iniciar Sesión' }}
           </button>
         </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService); // <--- Inyectar servicio

  username = signal('');
  password = signal('');
  isLoading = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);

    const credentials = {
      userName: this.username(), // El backend espera "userName" (email)
      password: this.password()
    };

    // Llamada al Backend Real
    this.authService.login(credentials).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);
        this.isLoading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.isLoading.set(false);
        // OJO: Este mensaje es diferente al antiguo, así sabremos si funciona
        alert('Error: Credenciales incorrectas o servidor apagado.');
      }
    });
  }
}