import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { InsightsComponent } from './insights/insights.component';
import { IntroComponent } from './intro/intro.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { NakedFeedComponent } from './nakedfeed/nakedfeed.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'intro', component: IntroComponent, pathMatch: 'full' },
  { path: '', redirectTo: '/intro', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'nakedfeed', component: NakedFeedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
