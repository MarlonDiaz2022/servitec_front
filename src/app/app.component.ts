import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
  CommonModule,
  FormsModule,
  RouterModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

}
