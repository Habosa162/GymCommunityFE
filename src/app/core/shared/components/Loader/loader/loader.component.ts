import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {

  ngOnInit() {
  document.body.classList.add('overflow-hidden', 'h-100vh');
}


}
