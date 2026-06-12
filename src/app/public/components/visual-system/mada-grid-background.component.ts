import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-mada-grid-background',
  template: `<div class="mada-grid-background" aria-hidden="true"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MadaGridBackgroundComponent {}
