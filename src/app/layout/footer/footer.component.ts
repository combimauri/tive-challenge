import { Component } from '@angular/core';

@Component({
  selector: 'tive-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
