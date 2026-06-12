import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-homepage-editor-page',
  template: `
    <section class="grid gap-5">
      <div>
        <p class="text-sm font-black text-teal-700">Homepage</p>
        <h1 class="mt-2 text-3xl font-black">تحرير الصفحة الرئيسية</h1>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        @for (section of sections; track section.key) {
          <article class="rounded-lg bg-white p-5 shadow-sm">
            <p class="text-xs font-black text-slate-500">{{ section.key }}</p>
            <h2 class="mt-2 text-xl font-black">{{ section.title }}</h2>
            <p class="mt-3 leading-7 text-slate-600">{{ section.body }}</p>
            <button class="mada-btn mada-btn-secondary mt-5" type="button">تحرير</button>
          </article>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageEditorPage {
  readonly sections = [
    { key: 'hero', title: 'Hero', body: 'العنوان الرئيسي، الرسالة، وأزرار CTA.' },
    { key: 'tracks', title: 'Tracks', body: 'ترتيب وإظهار المسارات العامة.' },
    { key: 'final_cta', title: 'Final CTA', body: 'رسالة التحويل النهائية وسبب التواصل الافتراضي.' }
  ];
}
