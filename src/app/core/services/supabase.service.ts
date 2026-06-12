import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Database } from '../models/supabase.types';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly configured = Boolean(environment.supabaseUrl && environment.supabaseAnonKey);
  private readonly instance: SupabaseClient<Database> | null = this.configured
    ? createClient<Database>(environment.supabaseUrl, environment.supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      })
    : null;

  get isConfigured(): boolean {
    return this.configured;
  }

  get client(): SupabaseClient<Database> {
    if (!this.instance) {
      throw new Error('Supabase is not configured. Add supabaseUrl and supabaseAnonKey in the environment files.');
    }

    return this.instance;
  }
}
