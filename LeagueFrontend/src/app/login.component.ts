import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; 

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
  private authService = inject(AuthService);

  username = signal('');
  password = signal('');
  isLoading = signal(false);

  onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);

    const credentials = {
      userName: this.username(),
      password: this.password()
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        // En este punto el 'tap' del servicio ya extrajo el rol del token
        this.isLoading.set(false);

        const role = this.authService.getRole();
        console.log('Rol final para redirigir:', role); 

        // Normalizamos el rol a string para evitar errores
        const roleStr = String(role);

        // Redirección segura
        if (roleStr === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (roleStr === 'Committee' || roleStr === 'CommitteeMember') {
          this.router.navigate(['/committee']);
        } else if (roleStr === 'Delegate') {
          this.router.navigate(['/delegate']);
        } else {
          // Si no es ninguno, al inicio
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error login:', err);
        this.isLoading.set(false);
        alert('Credenciales incorrectas');
      }
    });
  }
}