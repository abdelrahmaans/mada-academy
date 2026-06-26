import { NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentItem } from '../../../core/models/content.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface SwiperContainerElement extends HTMLElement {
  swiper?: {
    autoplay?: {
      start(): void;
      stop(): void;
    };
  };
}

type PlayerKind = 'iframe' | 'video' | 'external';

@Component({
  selector: 'app-reels-section',
  imports: [NgOptimizedImage, RevealOnScrollDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="mada-section">
      <div class="mada-shell">
        <div appRevealOnScroll>
          <p class="mada-eyebrow">Content Hub</p>
          <h2 class="mt-4 text-4xl font-black">ريلز ومحتوى يساعد ولي الأمر والطفل</h2>
        </div>

        @if (items().length) {
          <swiper-container
            class="mada-swiper mt-8"
            autoplay='{"delay":4200,"disableOnInteraction":false,"pauseOnMouseEnter":true}'
            loop="true"
            pagination="true"
            slides-per-view="1"
            space-between="16"
            breakpoints='{"768":{"slidesPerView":2,"spaceBetween":18},"1024":{"slidesPerView":3,"spaceBetween":20}}'
            (mouseenter)="pause($event)"
            (mouseleave)="play($event)"
          >
            @for (item of items(); track item.id; let first = $first) {
              <swiper-slide>
                <article class="mada-card mada-card-interactive min-h-72 overflow-hidden" [class.border-teal-400]="first">
                  <button class="block w-full cursor-pointer border-0 bg-transparent p-0 text-start" type="button" (click)="openPlayer(item)" [attr.aria-label]="'تشغيل ' + item.title">
                    @if (item.thumbnail_url) {
                      <div class="mada-image-zoom relative aspect-video overflow-hidden bg-slate-100">
                        <img [ngSrc]="item.thumbnail_url" [alt]="item.title" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" class="object-cover" />
                        <span class="mada-play-chip absolute start-4 top-4" aria-hidden="true">▶</span>
                      </div>
                    } @else {
                      <div class="relative grid aspect-video place-items-center bg-[var(--mada-navy)] text-white">
                        <span class="font-mono text-3xl">{{ item.platform }}</span>
                        <span class="mada-play-chip absolute start-4 top-4" aria-hidden="true">▶</span>
                      </div>
                    }
                  </button>
                  <div class="p-5">
                    <div class="flex flex-wrap items-center gap-2">
                      @if (first) {
                        <span class="rounded-full bg-[var(--mada-amber)] px-3 py-1 text-xs font-black text-slate-950">Featured Reel</span>
                      }
                      <span class="rounded-full bg-[color-mix(in_srgb,var(--mada-mint)_70%,white)] px-3 py-1 text-xs font-black text-teal-900">{{ item.platform }}</span>
                      <span class="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-black text-[var(--muted)]">{{ item.category }}</span>
                    </div>
                    <h3 class="mt-4 text-2xl font-black">{{ item.title }}</h3>
                    <div class="mt-8 flex flex-wrap gap-2">
                      <button class="mada-btn mada-btn-primary" type="button" (click)="openPlayer(item)">شاهد داخل الموقع</button>
                      <a class="mada-btn mada-btn-secondary" [href]="item.external_link" target="_blank" rel="noopener">فتح خارجي</a>
                    </div>
                  </div>
                </article>
              </swiper-slide>
            }
          </swiper-container>
        } @else {
          <div class="mt-8 grid gap-4 md:grid-cols-3" aria-hidden="true">
            <div class="mada-skeleton"></div>
            <div class="mada-skeleton"></div>
            <div class="mada-skeleton"></div>
          </div>
        }
      </div>
    </section>

    @if (selectedItem(); as item) {
      <div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/78 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" [attr.aria-label]="item.title" (click)="closePlayer()">
        <div class="w-full max-w-4xl overflow-hidden rounded-lg bg-[var(--surface)] shadow-2xl" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between gap-3 border-b border-[var(--line)] p-4">
            <div>
              <p class="text-sm font-black text-[var(--mada-teal)]">{{ item.platform }} · {{ item.category }}</p>
              <h3 class="text-xl font-black">{{ item.title }}</h3>
            </div>
            <button class="mada-btn mada-btn-secondary size-11 p-0" type="button" aria-label="إغلاق مشغل الريل" (click)="closePlayer()">×</button>
          </div>

          <div class="bg-black">
            @if (playerKind() === 'iframe' && safePlayerUrl()) {
              <iframe class="aspect-video w-full" [src]="safePlayerUrl()" title="Mada reel player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            } @else if (playerKind() === 'video') {
              <video class="aspect-video w-full bg-black" [src]="item.external_link" controls autoplay playsinline></video>
            } @else {
              <div class="grid min-h-72 place-items-center p-6 text-center text-white">
                <div>
                  <p class="text-2xl font-black">الرابط ده لا يدعم التشغيل داخل الموقع.</p>
                  <a class="mada-btn mada-btn-primary mt-5" [href]="item.external_link" target="_blank" rel="noopener">افتح المحتوى</a>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReelsSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly items = input.required<ContentItem[]>();
  readonly selectedItem = signal<ContentItem | null>(null);
  readonly playerKind = computed<PlayerKind>(() => {
    const item = this.selectedItem();
    if (!item) {
      return 'external';
    }

    if (this.isDirectVideo(item.external_link)) {
      return 'video';
    }

    return this.embedUrl(item) ? 'iframe' : 'external';
  });
  readonly safePlayerUrl = computed<SafeResourceUrl | null>(() => {
    const item = this.selectedItem();
    if (!item) {
      return null;
    }

    const url = this.embedUrl(item);
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  openPlayer(item: ContentItem): void {
    this.selectedItem.set(item);
  }

  closePlayer(): void {
    this.selectedItem.set(null);
  }

  pause(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.stop();
  }

  play(event: Event): void {
    (event.currentTarget as SwiperContainerElement).swiper?.autoplay?.start();
  }

  private embedUrl(item: ContentItem): string | null {
    const url = item.external_link.trim();
    return this.youtubeEmbedUrl(url) ?? this.instagramEmbedUrl(url) ?? this.tiktokEmbedUrl(url);
  }

  private youtubeEmbedUrl(url: string): string | null {
    const id =
      this.match(url, /youtu\.be\/([a-zA-Z0-9_-]{6,})/) ??
      this.match(url, /youtube\.com\/watch\?[^#]*v=([a-zA-Z0-9_-]{6,})/) ??
      this.match(url, /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/) ??
      this.match(url, /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);

    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }

  private instagramEmbedUrl(url: string): string | null {
    const shortcode =
      this.match(url, /instagram\.com\/reel\/([^/?#]+)/) ??
      this.match(url, /instagram\.com\/p\/([^/?#]+)/) ??
      this.match(url, /instagram\.com\/tv\/([^/?#]+)/);

    return shortcode ? `https://www.instagram.com/reel/${shortcode}/embed` : null;
  }

  private tiktokEmbedUrl(url: string): string | null {
    const videoId = this.match(url, /tiktok\.com\/@[^/]+\/video\/(\d+)/);
    return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
  }

  private isDirectVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  }

  private match(value: string, expression: RegExp): string | null {
    return expression.exec(value)?.[1] ?? null;
  }
}
