import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <main class="grid min-h-dvh place-items-center bg-slate-950 p-4" dir="rtl">
      <section class="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl" aria-labelledby="login-title">
        <p class="text-sm font-black text-teal-700">Mada CMS</p>
        <h1 id="login-title" class="mt-2 text-3xl font-black">تسجيل الدخول</h1>
        <form class="mt-6 grid gap-4" [formGroup]="form" (ngSubmit)="submit()">
          <label class="grid gap-2 font-black">
            البريد الإلكتروني
            <input class="rounded-lg border border-slate-300 px-3 py-3" formControlName="email" type="email" autocomplete="email" />
          </label>
          <label class="grid gap-2 font-black">
            كلمة المرور
            <input class="rounded-lg border border-slate-300 px-3 py-3" formControlName="password" type="password" autocomplete="current-password" />
          </label>
          @if (error()) {
            <p class="rounded-lg bg-red-50 p-3 text-red-800" role="alert">{{ error() }}</p>
          }
          <button class="mada-btn mada-btn-primary w-full" type="submit" [disabled]="form.invalid || loading()">{{ loading() ? 'جاري الدخول...' : 'دخول' }}</button>
        </form>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value = this.form.getRawValue();
    const error = await this.auth.signIn(value.email, value.password);
    this.loading.set(false);

    if (error) {
      this.error.set(error);
      return;
    }

    await this.router.navigateByUrl('/admin/dashboard');
  }
}
