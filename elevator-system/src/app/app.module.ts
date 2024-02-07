import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevatorComponent } from './elevator/elevator.component';
import { ElevatorWithoutPeopleComponent } from './elevator-without-people/elevator-without-people.component';
@NgModule({
  declarations: [
    AppComponent,
    ElevatorComponent,
    ElevatorWithoutPeopleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
