import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-table',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent {}
