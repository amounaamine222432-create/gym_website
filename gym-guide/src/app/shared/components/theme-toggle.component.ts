import { Component } from '@angular/core';
@Component({
  selector:'app-theme-toggle',
  standalone:true,
  template:`<button class="btn btn-sm btn-outline-secondary rounded-circle" (click)="toggle()" title="Mode sombre/clair"><i [class]="icon"></i></button>`
})
export class ThemeToggleComponent{
  dark=false;
  icon='bi bi-moon';
  toggle(){
    this.dark=!this.dark;
    document.body.classList.toggle('dark',this.dark);
    this.icon=this.dark?'bi bi-sun text-warning':'bi bi-moon';
  }
}
