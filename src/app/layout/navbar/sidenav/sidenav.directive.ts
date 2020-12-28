import { AfterViewInit, Directive, ElementRef } from '@angular/core';

import { Sidenav } from 'materialize-css';

@Directive({
  selector: '[tiveSidenav]',
})
export class SidenavDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    Sidenav.init(this.elementRef.nativeElement);
  }
}
