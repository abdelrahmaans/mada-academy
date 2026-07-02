import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LeadModalConfig } from '../../../core/models/lead.models';
import { Track } from '../../../core/models/track.models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { SectionBlobComponent } from '../visual-system/section-blob.component';
import { TrackIconVisualComponent } from '../visual-system/track-icon-visual.component';

interface TrackShowcase {
  color: string;
  index: number;
  pathLabel: string;
  toolsLabel: string;
  promise: string;
  visualTitle: string;
  codeLines: string[];
  learn: string[];
  outcomes: string[];
  system: string[];
  closingTitle: string;
  closingText: string;
}

@Component({
  selector: 'app-tracks-section',
  imports: [RevealOnScrollDirective, SectionBlobComponent, TrackIconVisualComponent],
  template: `
    <section id="tracks" class="mada-section relative overflow-hidden bg-[color-mix(in_srgb,var(--mada-mint)_22%,transparent)]">
      <app-section-blob tone="amber" />
      <div class="mada-shell relative">
        <div class="mx-auto max-w-3xl text-center" appRevealOnScroll>
          <p class="mada-eyebrow">المسارات</p>
          <h2 class="mada-title">اختار المسار المناسب لطفلك بوضوح</h2>
          <p class="mada-lead mt-4">كل مسار متقسم كرحلة تعليمية واضحة: سن مناسب، أدوات، نظام تعلم، ومخرجات يقدر الطفل يوريها ويفتخر بيها.</p>
        </div>

        <div class="mt-10 grid gap-7 lg:gap-9" appRevealOnScroll revealTarget="article" [revealStagger]="0.08">
          @for (track of tracks(); track track.slug) {
            @let meta = trackMeta(track.slug);
            <article class="mada-track-showcase" [style.--track-color]="meta.color">
              <div class="mada-track-story-bars" aria-hidden="true">
                @for (step of steps; track step) {
                  <span [class.is-active]="step === meta.index" [class.is-past]="step < meta.index"></span>
                }
              </div>

              <div class="mada-track-hero-grid">
                <div class="relative min-w-0">
                  <div class="flex flex-wrap items-center gap-3">
                    <span class="mada-track-pill">{{ meta.pathLabel }}</span>
                    <span class="mada-track-category">Mada Academy</span>
                  </div>

                  <h3 class="mt-6 text-5xl font-black leading-tight text-[var(--track-color)] md:text-6xl">{{ track.title }}</h3>
                  <p class="mt-3 text-2xl font-black text-[var(--text)]">{{ track.age }} سنة</p>

                  <div class="mt-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-lg font-black shadow-sm">
                    <span>{{ meta.toolsLabel }}</span>
                    @for (tool of track.tools; track tool) {
                      <span class="rounded-full bg-[color-mix(in_srgb,var(--track-color)_12%,var(--surface))] px-3 py-1 text-sm text-[var(--track-color)]">{{ tool }}</span>
                    }
                  </div>

                  <p class="mt-6 max-w-xl text-2xl font-black leading-relaxed text-[var(--mada-navy)] dark:text-white">{{ meta.promise }}</p>
                  <p class="mt-3 max-w-xl leading-8 text-[var(--muted)]">{{ track.description }}</p>
                </div>

                <div class="mada-track-art" aria-hidden="true">
                  <div class="mada-track-art-orb"></div>
                  <div class="mada-track-main-icon">
                    <app-track-icon-visual [slug]="track.slug" [alt]="track.title + ' visual'" />
                  </div>
                  <div class="mada-track-code-card">
                    <div class="flex gap-2">
                      <span></span><span></span><span></span>
                    </div>
                    <strong>{{ meta.visualTitle }}</strong>
                    @for (line of meta.codeLines; track line) {
                      <p>{{ line }}</p>
                    }
                  </div>
                  <div class="mada-track-floating-badge">XP + Project</div>
                </div>
              </div>

              <div class="mada-track-panels-grid">
                <div class="mada-track-panel">
                  <h4>ماذا سيتعلم طفلك؟</h4>
                  <ul>
                    @for (item of meta.learn; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
                <div class="mada-track-panel">
                  <h4>الأدوات المستخدمة</h4>
                  <p>{{ track.focus }}</p>
                  <div class="mt-4 flex flex-wrap justify-center gap-2">
                    @for (tool of track.tools; track tool) {
                      <span class="mada-track-tool">{{ tool }}</span>
                    }
                  </div>
                </div>
                <div class="mada-track-panel">
                  <h4>مخرجات المسار</h4>
                  <ul>
                    @for (item of meta.outcomes; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
                <div class="mada-track-panel">
                  <h4>نظام التعلم</h4>
                  <ul>
                    @for (item of meta.system; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              </div>

              <div class="mada-track-closing">
                <div>
                  <strong>{{ meta.closingTitle }}</strong>
                  <p>{{ meta.closingText }}</p>
                </div>
                <button class="mada-btn mada-btn-primary" type="button" (click)="openLead.emit({ sourcePage: 'home', sourceSection: 'tracks', reason: 'start_track', selectedTrack: track.slug })">ابدأ هذا المسار</button>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TracksSectionComponent {
  readonly tracks = input.required<Track[]>();
  readonly openLead = output<LeadModalConfig>();
  readonly steps = [1, 2, 3, 4, 5];

  private readonly fallbackMeta: TrackShowcase = {
    color: '#0d9488',
    index: 1,
    pathLabel: 'مسار مناسب',
    toolsLabel: 'تعلم عملي',
    promise: 'نحوّل الفضول إلى مشروع واضح.',
    visualTitle: 'learn()',
    codeLines: ['think()', 'build()', 'share()'],
    learn: ['تفكير منطقي', 'حل مشكلات', 'تطبيق عملي', 'ثقة في العرض'],
    outcomes: ['مشروع قابل للعرض', 'فهم أساسيات البرمجة', 'ملف أعمال بسيط'],
    system: ['مشاريع عملية', 'أنشطة تفاعلية', 'متابعة فردية', 'بيئة آمنة ومحفزة'],
    closingTitle: 'ابدأ الرحلة المناسبة',
    closingText: 'نختار المسار حسب عمر الطفل ومستواه.'
  };

  private readonly metaBySlug: Record<string, TrackShowcase> = {
    tiny: {
      color: '#4d8f37',
      index: 1,
      pathLabel: 'المسار الأول',
      toolsLabel: 'Scratch + تفكير منطقي',
      promise: 'الخطوة الأولى في رحلة طفلك.',
      visualTitle: 'Tiny journey',
      codeLines: ['play()', 'think()', 'create()'],
      learn: ['التفكير المنطقي وحل المشكلات', 'أساسيات البرمجة بطريقة مرئية', 'تصميم ألعاب وقصص تفاعلية', 'تنمية الإبداع والثقة بالنفس'],
      outcomes: ['ألعاب ومشاريع خاصة به', 'فهم أساسيات البرمجة', 'ثقة في استخدام الكمبيوتر', 'استعداد للمسار التالي'],
      system: ['مشاريع عملية', 'أنشطة تفاعلية', 'متابعة فردية', 'بيئة آمنة ومحفزة'],
      closingTitle: 'جاهز يبدأ رحلته؟',
      closingText: 'المستقبل يبدأ بخطوة صغيرة اليوم.'
    },
    explore: {
      color: '#0967c6',
      index: 2,
      pathLabel: 'المسار الثاني',
      toolsLabel: 'Scratch + AI + مشاريع',
      promise: 'نحوّل الفضول إلى ابتكار.',
      visualTitle: 'Explore ideas',
      codeLines: ['ask(AI)', 'designGame()', 'present()'],
      learn: ['تصميم ألعاب تفاعلية بسكراتش', 'مقدمة في الذكاء الاصطناعي', 'حل المشكلات بطريقة ممتعة', 'تحويل الأفكار لمشاريع حقيقية'],
      outcomes: ['ألعاب ومشاريع تفاعلية', 'عروض تقديمية لمشاريعه', 'شهادة إنجاز في نهاية المرحلة', 'Portfolio خاص به'],
      system: ['مشاريع عملية', 'أنشطة تفاعلية', 'تعلم بالممارسة', 'متابعة فردية'],
      closingTitle: 'في هذه المرحلة',
      closingText: 'نزرع الشغف، ونبني الثقة، ونطلق الإبداع.'
    },
    build: {
      color: '#6d35b8',
      index: 3,
      pathLabel: 'المسار الثالث',
      toolsLabel: 'Python + Algorithms + GitHub',
      promise: 'تبني المبرمج الحقيقي ونحوّل الأفكار إلى مشاريع قوية.',
      visualTitle: 'Build logic',
      codeLines: ['solve(problem)', 'commit()', 'improve()'],
      learn: ['أساسيات Python بشكل قوي', 'الخوارزميات وحل المشكلات', 'هيكل البيانات والمنطق البرمجي', 'استخدام Git و GitHub', 'بناء مشاريع حقيقية من الصفر'],
      outcomes: ['مشاريع برمجية متكاملة', 'رفع المشاريع على GitHub', 'فهم عميق للخوارزميات', 'ملف أعمال قوي', 'جاهزية لمستوى احترافي'],
      system: ['مشاريع عملية', 'أنشطة تفاعلية', 'تحديات برمجية', 'متابعة فردية'],
      closingTitle: 'من هنا يبدأ طريق الاحتراف!',
      closingText: 'مهارات اليوم هي مستقبل الغد.'
    },
    code: {
      color: '#dc2626',
      index: 4,
      pathLabel: 'المسار الرابع',
      toolsLabel: 'Advanced Python + تخصص',
      promise: 'تخصص أعمق، مهارات احترافية، ومستقبل أقوى.',
      visualTitle: 'Code pro',
      codeLines: ['class Project', 'optimize()', 'return success'],
      learn: ['إتقان Python بمستوى متقدم', 'هياكل بيانات وخوارزميات متقدمة', 'البرمجة كائنية التوجه OOP', 'مشاريع برمجية احترافية', 'تحضير للمسابقات والبرمجة التنافسية'],
      outcomes: ['بناء مشاريع برمجية متكاملة', 'حل مسائل معقدة بكفاءة', 'المشاركة في مسابقات برمجية', 'Portfolio احترافي قوي', 'جاهزية للتخصصات التقنية'],
      system: ['مشاريع عملية', 'أنشطة تفاعلية', 'جلسات كود ومراجعة', 'متابعة فردية', 'بيئة آمنة ومحفزة'],
      closingTitle: 'ابدأ التخصص وكن مبرمج المستقبل!',
      closingText: 'من الشغف إلى الاحتراف مع Mada Code.'
    },
    web: {
      color: '#f97316',
      index: 5,
      pathLabel: 'المسار الخامس',
      toolsLabel: 'HTML -> React -> Full Stack',
      promise: 'من أول سطر كود لحد بناء تطبيقات متكاملة.',
      visualTitle: 'Web launch',
      codeLines: ['layout()', 'react()', 'deploy()'],
      learn: ['بناء صفحات ويب احترافية', 'تصميم واجهات تفاعلية', 'برمجة باستخدام JavaScript', 'بناء تطبيقات React', 'تطوير مشاريع Full Stack متكاملة'],
      outcomes: ['مشاريع ويب متكاملة جاهزة للعرض', 'فهم عميق لتقنيات الويب الحديثة', 'بناء تطبيقات تفاعلية وسريعة', 'رفع المشاريع على الإنترنت', 'جاهزية للمنافسات وسوق العمل'],
      system: ['مشاريع عملية', 'أنشطة تفاعلية', 'جلسات كود ومراجعة', 'متابعة فردية', 'بيئة آمنة ومحفزة'],
      closingTitle: 'مستقبلك في البرمجة يبدأ من هنا!',
      closingText: 'اصنع موقعك، وابن أفكارك، وأطلق مشروعك للعالم.'
    }
  };

  trackMeta(slug: string): TrackShowcase {
    const normalizedSlug = slug.toLowerCase();
    const key = Object.keys(this.metaBySlug).find((name) => normalizedSlug.includes(name));
    return key ? this.metaBySlug[key] : this.fallbackMeta;
  }
}
