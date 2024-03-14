import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.scss'],
})
export class AnimalComponent  implements OnInit {
  @Input() animal: any;

  constructor() { }

  ngOnInit() {}

}
