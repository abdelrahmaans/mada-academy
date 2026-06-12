import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicFooterComponent } from '../../public/components/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../../public/components/public-header/public-header.component';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <app-public-header />
    <router-outlet />
    <app-public-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {}
