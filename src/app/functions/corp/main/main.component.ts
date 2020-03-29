import { Component, OnInit } from '@angular/core';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  faRegistered = faRegistered;

  constructor() { }

  ngOnInit(): void {
  }

}
