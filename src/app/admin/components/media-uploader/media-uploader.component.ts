import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MediaService } from '../../../core/services/media.service';

@Component({
  selector: 'app-media-uploader',
  imports: [NgOptimizedImage],
  template: `
    <div class="grid gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center font-black">
      <label class="grid gap-3">
        {{ label() }}
        <input #fileInput class="mx-auto" type="file" accept="image/*" (change)="upload($event)" />
      </label>

      @if (previewUrl()) {
        <div class="mx-auto grid w-full max-w-xs gap-3">
          <div class="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img [ngSrc]="previewUrl()!" alt="معاينة الصورة" fill sizes="320px" class="object-cover" />
          </div>
          <button class="mada-btn mada-btn-secondary w-full" type="button" (click)="clear(fileInput)">إزالة الصورة</button>
        </div>
      }

      @if (message()) {
        <p class="text-sm font-bold text-slate-600">{{ message() }}</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaUploaderComponent {
  private readonly media = inject(MediaService);
  readonly label = input('رفع صورة');
  readonly folder = input('cms');
  readonly previewUrl = input<string | null>(null);
  readonly resetToken = input(0);
  readonly uploaded = output<string>();
  readonly cleared = output<void>();
  readonly message = signal('');

  constructor() {
    effect(() => {
      this.resetToken();
      this.message.set('');
    });
  }

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
      inputElement.value = '';
      return;
    }

    this.message.set(result.error ?? 'تعذر رفع الصورة');
  }

  clear(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.message.set('');
    this.cleared.emit();
  }
}
