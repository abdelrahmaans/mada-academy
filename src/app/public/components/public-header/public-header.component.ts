import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideMenu, LucideMoon, LucideRocket, LucideSun, LucideX } from '@lucide/angular';
import { ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-public-header',
  imports: [NgOptimizedImage, RouterLink, LucideMenu, LucideMoon, LucideRocket, LucideSun, LucideX],
  template: `
    <header class="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-xl">
      <div class="mada-shell flex min-h-16 items-center justify-between gap-3">
        <a routerLink="/" class="flex min-w-0 items-center gap-3 text-inherit no-underline" aria-label="Mada Academy home" (click)="closeMenu()">
          <span class="mada-logo-mark shrink-0" aria-hidden="true">
            <img [ngSrc]="logoMarkSrc()" alt="" width="96" height="96" priority />
          </span>
          <span class="min-w-0">
            <strong class="block truncate text-lg leading-5">Mada Academy</strong>
            <span class="block truncate text-xs font-bold text-[var(--mada-slate)]">لا حدود للمدى</span>
          </span>
        </a>

        <nav class="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          @for (item of navItems; track item.href) {
            <a class="rounded-lg px-3 py-2 text-sm font-bold text-[var(--muted)] transition hover:bg-[color-mix(in_srgb,var(--mada-mint)_45%,transparent)] hover:text-[var(--text)]" [routerLink]="item.href">{{ item.label }}</a>
          }
        </nav>

        <div class="hidden items-center gap-2 lg:flex">
          <a [href]="workshopCtaLink()" class="mada-btn mada-btn-secondary">احجز ورشة مجانية</a>
          <a [href]="primaryCtaLink()" class="mada-btn mada-btn-primary"><svg lucideRocket class="size-4" aria-hidden="true"></svg>ابدأ رحلة طفلك</a>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button type="button" class="mada-btn mada-btn-secondary size-11 p-0" (click)="toggleTheme()" [attr.aria-label]="isDark() ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'">
            @if (isDark()) { <svg lucideSun class="size-5" aria-hidden="true"></svg> } @else { <svg lucideMoon class="size-5" aria-hidden="true"></svg> }
          </button>
          <button type="button" class="mada-btn mada-btn-secondary size-11 p-0 md:hidden" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen()" aria-controls="mobile-menu" [attr.aria-label]="menuOpen() ? 'إغلاق القائمة' : 'فتح القائمة'">
            @if (menuOpen()) { <svg lucideX class="size-5" aria-hidden="true"></svg> } @else { <svg lucideMenu class="size-5" aria-hidden="true"></svg> }
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="mobile-menu border-t border-[var(--line)] bg-[var(--surface)] md:hidden" [class.mobile-menu-open]="menuOpen()">
        <nav class="mada-shell grid gap-2 overflow-hidden py-4" aria-label="التنقل على الهاتف">
          @for (item of navItems; track item.href) {
            <a class="rounded-lg px-3 py-3 font-bold text-[var(--muted)] transition hover:bg-[color-mix(in_srgb,var(--mada-mint)_45%,transparent)] hover:text-[var(--text)]" [routerLink]="item.href" (click)="closeMenu()">{{ item.label }}</a>
          }
          <div class="grid gap-2 pt-2">
            <a [href]="workshopCtaLink()" class="mada-btn mada-btn-secondary w-full" (click)="closeMenu()">احجز ورشة مجانية</a>
            <a [href]="primaryCtaLink()" class="mada-btn mada-btn-primary w-full" (click)="closeMenu()"><svg lucideRocket class="size-4" aria-hidden="true"></svg>ابدأ رحلة طفلك</a>
          </div>
        </nav>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicHeaderComponent {
  private readonly document = inject(DOCUMENT);
  private readonly content = inject(ContentService);
  readonly menuOpen = signal(false);
  readonly isDark = signal(this.document.documentElement.classList.contains('dark'));
  readonly settings = signal<Record<string, string>>({});
  readonly navItems = [
    { href: '/', label: 'الرئيسية' },
    { href: '/tracks', label: 'المسارات' },
    { href: '/content', label: 'المحتوى' },
    { href: '/gallery', label: 'المعرض' },
    { href: '/contact', label: 'تواصل معنا' }
  ];

  constructor() {
    void this.content.siteSettings().then((settings) => this.settings.set(settings));
  }

  logoMarkSrc(): string {
    return this.isDark() ? 'assets/brand/mada-logo-mark-dark.png' : 'assets/brand/mada-logo-mark-light.png';
  }

  primaryCtaLink(): string {
    return this.settings()['primary_cta_link'] || '#lead-hero';
  }

  workshopCtaLink(): string {
    return this.settings()['workshop_cta_link'] || '#lead-final';
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.isDark.update((value) => {
      const next = !value;
      this.document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }
}
