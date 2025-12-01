
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      
      <!-- Back Button -->
      <a routerLink="/" class="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-500 hover:text-[#388e14] transition-colors group z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform">
          <path d="M19 12H5"></path>
          <path d="M12 19l-7-7 7-7"></path>
        </svg>
        <span class="text-sm font-medium">Volver al inicio</span>
      </a>

      <!-- Card Container -->
      <div class="w-full max-w-[420px] p-10 border border-gray-100 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white mb-8 relative z-0">
         
         <!-- Header -->
         <div class="text-center mb-8">
           <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Iniciar Sesión</h1>
           <p class="text-gray-500 text-sm font-normal">Bienvenido de nuevo a Liga Gremio Laboral.</p>
         </div>

         <!-- Form -->
         <form class="space-y-6" (ngSubmit)="onSubmit($event)">
           
           <!-- Username Input -->
           <div class="space-y-1.5">
             <label for="username" class="block text-sm font-medium text-gray-800">Usuario o Correo Electrónico</label>
             <input 
                id="username"
                name="username"
                type="text" 
                [ngModel]="username()"
                (ngModelChange)="username.set($event)"
                placeholder="tu_usuario@ejemplo.com" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] transition-all text-sm placeholder-gray-400 bg-white text-gray-900"
             >
           </div>

           <!-- Password Input -->
           <div class="space-y-1.5">
             <label for="password" class="block text-sm font-medium text-gray-800">Contraseña</label>
             <input 
                id="password"
                name="password"
                type="password" 
                [ngModel]="password()"
                (ngModelChange)="password.set($event)"
                placeholder="********" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a9f24]/20 focus:border-[#4a9f24] transition-all text-sm placeholder-gray-400 bg-white text-gray-900"
             >
           </div>

           <!-- Submit Button -->
           <button type="submit" class="w-full bg-[#388e14] hover:bg-[#2e7510] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm text-sm mt-2">
             Iniciar Sesión
           </button>

           <!-- Forgot Password -->
           <div class="text-center pt-2">
             <a href="#" class="text-xs font-semibold text-[#388e14] hover:underline">¿Olvidaste tu contraseña?</a>
           </div>

         </form>
      </div>

    </div>
  `
})
export class LoginComponent {
  private router = inject(Router);
  
  username = signal('');
  password = signal('');

  onSubmit(event: Event) {
    event.preventDefault();
    const user = this.username();
    const pass = this.password();

    if (user === 'admin' && pass === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user === 'delegado' && pass === 'delegado') {
      this.router.navigate(['/delegate']);
    } else if (user === 'arbitro' && pass === 'arbitro') {
      this.router.navigate(['/referee']);
    } else {
      alert('Credenciales incorrectas. Intente con admin/admin, delegado/delegado o arbitro/arbitro.');
    }
  }
}
