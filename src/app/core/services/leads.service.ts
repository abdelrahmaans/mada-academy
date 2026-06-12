import { Injectable, inject } from '@angular/core';
import { Lead, LeadFilters, LeadInsert, LeadStats, LeadStatus } from '../models/lead.models';
import { SupabaseService } from './supabase.service';

const localLeads: Lead[] = [];

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private readonly supabase = inject(SupabaseService);

  async createLead(payload: LeadInsert): Promise<{ ok: boolean; message?: string }> {
    const lead = {
      parent_name: payload.parent_name.trim(),
      phone: payload.phone.trim(),
      child_name: payload.child_name?.trim() || null,
      child_age: payload.child_age ?? null,
      selected_track: payload.selected_track || null,
      reason: payload.reason,
      message: payload.message?.trim() || null,
      source_page: payload.source_page || null,
      source_section: payload.source_section || null,
      status: payload.status ?? 'new'
    };

    if (!this.supabase.isConfigured) {
      localLeads.unshift({
        id: crypto.randomUUID(),
        ...lead,
        internal_notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return { ok: true };
    }

    const { error } = await this.supabase.client.from('leads').insert(lead);
    return { ok: !error, message: error?.message };
  }

  async getLeads(filters: LeadFilters = {}): Promise<Lead[]> {
    if (!this.supabase.isConfigured) {
      return this.filterLocal(filters);
    }

    let query = this.supabase.client.from('leads').select('*').order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.reason) {
      query = query.eq('reason', filters.reason);
    }

    if (filters.selected_track) {
      query = query.eq('selected_track', filters.selected_track);
    }

    if (filters.from) {
      query = query.gte('created_at', filters.from);
    }

    if (filters.to) {
      query = query.lte('created_at', filters.to);
    }

    const { data, error } = await query;
    return error || !data ? [] : data;
  }

  async listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
    return this.getLeads(filters);
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    return this.updateLead(id, { status });
  }

  async updateLeadNotes(id: string, internalNotes: string): Promise<boolean> {
    return this.updateLead(id, { internal_notes: internalNotes.trim() || null });
  }

  async getLeadStats(): Promise<LeadStats> {
    const leads = await this.getLeads();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      totalLeads: leads.length,
      newLeads: leads.filter((lead) => lead.status === 'new').length,
      leadsThisWeek: leads.filter((lead) => new Date(lead.created_at).getTime() >= weekAgo).length,
      mostRequestedTrack: this.mostRequestedTrack(leads),
      latestLeads: leads.slice(0, 5)
    };
  }

  whatsappUrl(phone: string, message: string): string {
    const normalizedPhone = phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  }

  statusLabel(status: LeadStatus): string {
    return {
      new: 'جديد',
      contacted: 'تم التواصل',
      qualified: 'مؤهل',
      enrolled: 'مشترك',
      closed: 'مغلق'
    }[status];
  }

  private async updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'internal_notes'>>): Promise<boolean> {
    if (!this.supabase.isConfigured) {
      const index = localLeads.findIndex((lead) => lead.id === id);
      if (index === -1) {
        return false;
      }

      localLeads[index] = { ...localLeads[index], ...patch, updated_at: new Date().toISOString() };
      return true;
    }

    const { error } = await this.supabase.client.from('leads').update(patch).eq('id', id);
    return !error;
  }

  private filterLocal(filters: LeadFilters): Lead[] {
    return localLeads.filter((lead) => {
      const statusOk = filters.status ? lead.status === filters.status : true;
      const reasonOk = filters.reason ? lead.reason === filters.reason : true;
      const trackOk = filters.selected_track ? lead.selected_track === filters.selected_track : true;
      const fromOk = filters.from ? lead.created_at >= filters.from : true;
      const toOk = filters.to ? lead.created_at <= filters.to : true;
      return statusOk && reasonOk && trackOk && fromOk && toOk;
    });
  }

  private mostRequestedTrack(leads: Lead[]): string | null {
    const counts = new Map<string, number>();
    for (const lead of leads) {
      if (lead.selected_track) {
        counts.set(lead.selected_track, (counts.get(lead.selected_track) ?? 0) + 1);
      }
    }

    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  }
}
