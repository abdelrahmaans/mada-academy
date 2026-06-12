export type LeadReason = 'start_track' | 'free_workshop' | 'ask_question' | 'pricing' | 'partnership' | 'other';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'enrolled' | 'closed';

export interface Lead {
  id: string;
  parent_name: string;
  phone: string;
  child_name: string | null;
  child_age: number | null;
  selected_track: string | null;
  reason: LeadReason;
  message: string | null;
  source_page: string | null;
  source_section: string | null;
  status: LeadStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadInsert {
  parent_name: string;
  phone: string;
  child_name?: string | null;
  child_age?: number | null;
  selected_track?: string | null;
  reason: LeadReason;
  message?: string | null;
  source_page?: string | null;
  source_section?: string | null;
  status?: LeadStatus;
}

export interface LeadFilters {
  status?: LeadStatus | '';
  reason?: LeadReason | '';
  selected_track?: string;
  from?: string;
  to?: string;
}

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  leadsThisWeek: number;
  mostRequestedTrack: string | null;
  latestLeads: Lead[];
}

export interface LeadModalConfig {
  sourcePage: string;
  sourceSection: string;
  reason: LeadReason;
  selectedTrack?: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  admin_id: string | null;
  note: string;
  created_at: string;
}
