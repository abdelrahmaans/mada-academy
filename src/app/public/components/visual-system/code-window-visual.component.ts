import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeWindowCardComponent } from './code-window-card.component';

@Component({
  selector: 'app-code-window-visual',
  imports: [CodeWindowCardComponent],
  template: `<app-code-window-card [title]="title()" [code]="code()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeWindowVisualComponent {
  readonly title = input('mada-session.ts');
  readonly code = input(`const path = mada
  .discover(child)
  .buildProject();`);
}
