import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevatorComponent } from './elevator/elevator.component';
import { ElevatorStatusComponent } from './elevator-status/elevator-status.component';
import { ElevatorWithoutPeopleComponent } from './elevator-without-people/elevator-without-people.component';
@NgModule({
  declarations: [
    AppComponent,
    ElevatorComponent,
    ElevatorStatusComponent,
    ElevatorWithoutPeopleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
