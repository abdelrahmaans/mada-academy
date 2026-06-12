import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-media-uploader',
  template: `
    <label class="grid gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center font-black">
      {{ label() }}
      <input class="mx-auto" type="file" accept="image/*" (change)="upload($event)" />
    </label>
    @if (message()) {
      <p class="mt-3 text-sm font-bold text-slate-600">{{ message() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaUploaderComponent {
  private readonly media = inject(MediaService);
  readonly label = input('رفع صورة');
  readonly folder = input('cms');
  readonly uploaded = output<string>();
  readonly message = signal('');

  async upload(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (!file) {
      return;
    }

    this.message.set('جاري الرفع...');
    const result = await this.media.uploadImage(file, 'mada-media', this.folder());
    if (result.url) {
      this.uploaded.emit(result.url);
      this.message.set('تم رفع الصورة بنجاح');
      return;
    }

    this.message.set(result.error ?? 'تعذر رفع الصورة');
  }
}
