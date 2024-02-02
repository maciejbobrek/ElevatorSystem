import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevatorComponent } from './elevator/elevator.component';
import { ElevatorStatusComponent } from './elevator-status/elevator-status.component';

@NgModule({
  declarations: [
    AppComponent,
    ElevatorComponent,
    ElevatorStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
