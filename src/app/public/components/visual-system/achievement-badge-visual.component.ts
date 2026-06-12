import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AchievementBadgeComponent } from './achievement-badge.component';

@Component({
  selector: 'app-achievement-badge-visual',
  imports: [AchievementBadgeComponent],
  template: `<app-achievement-badge [icon]="icon()" [title]="title()" [xp]="xp()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AchievementBadgeVisualComponent {
  readonly icon = input('★');
  readonly title = input('Badge');
  readonly xp = input(120);
}
