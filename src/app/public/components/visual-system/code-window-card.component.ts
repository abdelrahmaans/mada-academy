import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-code-window-card',
  template: `
    <article class="mada-code-window">
      <div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div class="flex gap-2" aria-hidden="true">
          <span class="size-3 rounded-full bg-red-400"></span>
          <span class="size-3 rounded-full bg-amber-300"></span>
          <span class="size-3 rounded-full bg-teal-300"></span>
        </div>
        <span class="font-mono text-xs text-teal-100">{{ title() }}</span>
      </div>
      <pre class="m-0 overflow-hidden p-5 text-left font-mono text-sm leading-7 text-teal-100" dir="ltr"><code>{{ code() }}</code></pre>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeWindowCardComponent {
  readonly title = input('mada-session.ts');
  readonly code = input(`const thinker = child
  .ask("why?")
  .debug()
  .buildProject();

mada.launch(idea);`);
}
