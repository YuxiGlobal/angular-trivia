import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CoreService } from '../services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  scores: Observable<{
    username: string,
    score: number
  }[]>

  constructor(private coreService: CoreService, private router: Router) { }

  ngOnInit(): void {
    this.scores = this.coreService.loadScores();
  }

  get userHasAlreadyPlayed():boolean {
    return this.coreService.userHasPlayed;
  }

  resetApp(): void {
    this.router.navigate(['/']);
  }

}
