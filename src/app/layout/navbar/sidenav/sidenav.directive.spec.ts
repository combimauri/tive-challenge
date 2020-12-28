import { ElementRef } from '@angular/core';

import { SidenavDirective } from './sidenav.directive';

class MockElementRef extends ElementRef {
  constructor() {
    super(undefined);
  }
}

describe('SidenavDirective', () => {
  it('should create an instance', () => {
    const directive = new SidenavDirective(new MockElementRef());
    expect(directive).toBeTruthy();
  });
});
