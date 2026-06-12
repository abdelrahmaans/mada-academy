import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-achievement-badge',
  template: `
    <div class="mada-achievement-badge">
      <span class="mada-achievement-icon" aria-hidden="true">{{ icon() }}</span>
      <span>
        <strong class="block">{{ title() }}</strong>
        <small class="font-mono text-[var(--mada-amber)]">+{{ xp() }} XP</small>
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementBadgeComponent {
  readonly icon = input('★');
  readonly title = input('Badge');
  readonly xp = input(120);
}
