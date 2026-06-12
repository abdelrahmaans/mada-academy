import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { Track } from '../../../core/models/track.models';
import { ContentService } from '../../../core/services/content.service';
import { LeadFormModalComponent } from '../../components/lead-form-modal/lead-form-modal.component';
import { TracksSectionComponent } from '../../components/tracks-section/tracks-section.component';

@Component({
  selector: 'app-tracks-page',
  imports: [TracksSectionComponent, LeadFormModalComponent],
  template: `
    <main>
      <app-tracks-section [tracks]="tracks()" (openLead)="leadConfig.set($event)" />
      <app-lead-form-modal [config]="leadConfig()" (close)="leadConfig.set(null)" />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TracksPage {
  private readonly content = inject(ContentService);
  readonly tracks = signal<Track[]>([]);
  readonly leadConfig = signal<LeadModalConfig | null>(null);

  constructor() {
    void this.content.tracks().then((tracks) => this.tracks.set(tracks));
  }
}
