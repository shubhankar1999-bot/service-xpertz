import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { ServicesComponent } from "./services/services.component";
import { VideosComponent } from "./videos/videos.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { BlogsComponent } from "./blogs/blogs.component";
import { CareersComponent } from "./careers/careers.component";
import { SigninComponent } from "./signin/signin.component";
import { PaymentComponent } from "./payment/payment.component";
import { ServiceNearbyComponent } from "./service-nearby/service-nearby.component";
import { BlogViewComponent } from "./blog-view/blog-view.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'contact', component: ContactUsComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'videos', component: VideosComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'blogs', component: BlogsComponent},
  {path: 'careers', component: CareersComponent},
  {path: 'login', component: SigninComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'service-nearby', component: ServiceNearbyComponent},
  {path: 'blog-view', component: BlogViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
