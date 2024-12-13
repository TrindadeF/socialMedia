import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { InsightsComponent } from './insights/insights.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RulesComponent } from './rules/rules.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FeedComponent } from './feed/feed.component';
import { NakedFeedComponent } from './nakedfeed/nakedfeed.component';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth.interceptor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PaymentsComponent } from './payments/payments.component';
import { PresentationComponent } from './presentation/presentation.component';
import { ChatComponent } from './chat/chat.component';
import { ModalComponent } from './modal/modal.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { ModalProfileComponent } from './modal-profile/modal-profile.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigComponent } from './config/config.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    InsightsComponent,
    LoginComponent,
    RegisterComponent,
    RulesComponent,
    FeedComponent,
    NakedFeedComponent,
    EditProfileComponent,
    ForgotPasswordComponent,
   
    PaymentsComponent,
    PresentationComponent,
    ChatComponent,
    ModalComponent,
    CheckboxComponent,
    NotificationsComponent,
    CommentModalComponent,
    ModalProfileComponent,
    PostDetailComponent,
    ConfigComponent,

   
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTabsModule,
    
   
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
