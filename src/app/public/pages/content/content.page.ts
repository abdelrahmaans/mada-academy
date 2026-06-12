import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentItem } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';
import { ReelsSectionComponent } from '../../components/reels-section/reels-section.component';

@Component({
  selector: 'app-content-page',
  imports: [ReelsSectionComponent],
  template: `
    <main>
      <app-reels-section [items]="items()" />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentPage {
  private readonly content = inject(ContentService);
  readonly items = signal<ContentItem[]>([]);

  constructor() {
    void this.content.contentItems().then((items) => this.items.set(items));
  }
}
