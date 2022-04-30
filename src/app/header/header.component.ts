import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Blogs, FirebaseService } from '../services/firebase.service';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {
  signedIn=false;

  constructor(public auth:SigninComponent,private firebaseService:FirebaseService) { }
  
  ngOnInit(): void {
    if(localStorage.getItem('user_data')!=null){
      this.signedIn=true;
    }
    
  }
  ngAfterViewInit(){
    this.ngOnInit()
    console.log(this.signedIn)
  }

  async logout1() {
    window.alert("User Logged Out");
    this.signedIn=false
    localStorage.clear();
  }
  
  

}
