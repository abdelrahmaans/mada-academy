import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  readonly user = signal<User | null>(null);
  readonly session = signal<Session | null>(null);

  constructor() {
    void this.loadSession();
  }

  async loadSession(): Promise<void> {
    if (!this.supabase.isConfigured) {
      return;
    }

    const { data } = await this.supabase.client.auth.getSession();
    this.session.set(data.session);
    this.user.set(data.session?.user ?? null);

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
    });
  }

  async signIn(email: string, password: string): Promise<string | null> {
    if (!this.supabase.isConfigured) {
      this.user.set({ id: 'local-admin', email } as User);
      return null;
    }

    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async signOut(): Promise<void> {
    if (this.supabase.isConfigured) {
      await this.supabase.client.auth.signOut();
    }

    this.user.set(null);
    await this.router.navigateByUrl('/admin/login');
  }

  isAuthenticated(): boolean {
    return Boolean(this.user()) || !this.supabase.isConfigured;
  }

  async hasSession(): Promise<boolean> {
    if (!this.supabase.isConfigured) {
      return true;
    }

    const { data } = await this.supabase.client.auth.getSession();
    this.session.set(data.session);
    this.user.set(data.session?.user ?? null);
    return Boolean(data.session);
  }

  async isAdminOrEditor(): Promise<boolean> {
    if (!this.supabase.isConfigured) {
      return true;
    }

    const user = this.user();
    if (!user) {
      return false;
    }

    const { data, error } = await this.supabase.client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return !error && Boolean(data?.role === 'admin' || data?.role === 'editor');
  }
}
