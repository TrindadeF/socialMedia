import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { InsightsComponent } from './insights/insights.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedComponent } from './feed/feed.component';
import { NakedFeedComponent } from './nakedfeed/nakedfeed.component';
import { AuthGuard } from './auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PaymentsComponent } from './payments/payments.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RulesComponent } from './rules/rules.component';
import { ChatComponent } from './chat/chat.component';
import { PresentationComponent } from './presentation/presentation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'insights', component: InsightsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'nakedfeed', component: NakedFeedComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'chat/:userId', component: ChatComponent },
  { path: 'presentation', component: PresentationComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'notifications', component: NotificationsComponent },
  {
    path: 'primaryFeed/posts/:postId/comments',
    component: PostDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
