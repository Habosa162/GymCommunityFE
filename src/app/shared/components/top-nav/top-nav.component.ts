import { Component } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  imports: [],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.css',
})
export class TopNavComponent {
  toggleDarkMode(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      // document.body.classList.add('dark-mode');
      document.body.classList.remove('dark-mode');
    } else {
            document.body.classList.add('dark-mode');

      // document.body.classList.remove('dark-mode');
    }
  }
}
