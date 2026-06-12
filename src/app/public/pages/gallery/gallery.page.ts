import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GalleryItem } from '../../../core/models/content.models';
import { ContentService } from '../../../core/services/content.service';
import { GallerySectionComponent } from '../../components/gallery-section/gallery-section.component';

@Component({
  selector: 'app-gallery-page',
  imports: [GallerySectionComponent],
  template: `
    <main>
      <app-gallery-section [items]="items()" />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryPage {
  private readonly content = inject(ContentService);
  readonly items = signal<GalleryItem[]>([]);

  constructor() {
    void this.content.gallery().then((items) => this.items.set(items));
  }
}
