import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orbital-badges',
  template: `
    <div class="mada-orbit" aria-hidden="true">
      @for (badge of badges; track badge) {
        <span>{{ badge }}</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrbitalBadgesComponent {
  readonly badges = ['XP', 'Badge', 'Project', 'Logic', 'AI', 'Scratch', 'Python'];
}
