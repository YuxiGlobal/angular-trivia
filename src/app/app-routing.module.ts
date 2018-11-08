import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: 'leaderboard', component: DashboardComponent },
  { path: '', component: MainComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', component: MainComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }