import { Component, OnInit,AfterViewInit,OnDestroy } from '@angular/core';
import { getAuth,RecaptchaVerifier, signInWithPhoneNumber,PhoneAuthProvider,signInWithCredential } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
declare var $:any;
declare var grecaptcha: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  private _isLoggedIn = new Subject<boolean>();
  otp!: string;
  verify: any;
  wndowRef:any;
  auth=getAuth();
  phoneNumber:any;
  isSignedIn!: boolean;
  text="sample";
  constructor(public firebaseService:FirebaseService,private router:Router,private auth1:AuthService){
    this.wndowRef=auth1.nativeWindow
  }
  ngOnInit(){
    
    
    $('.spinner').hide();
    
 
  }

  ngAfterViewInit(){
    $('.email_part').hide();
    $('.contain').show();
    $('.spinner').hide();
    this.wndowRef.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button', {
        size: 'invisible',
        'callback': function(response: any) {
          // reCAPTCHA solved - will proceed with submit function
          console.log(response);
        },
        'expired-callback':function() {
          // reCAPTCHA solved - will proceed with submit function
          this.wndowRef.recaptchaVerifier.reset();
        },
      },
      this.auth
    );
    this.wndowRef.recaptchaVerifier.render()
  }
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

   async onSignUp(email:string,password:string) {
    await this.firebaseService.signUp(email,password);
    if(this.firebaseService.isLoggedIn){
      
      window.alert("Sign Up successful"+localStorage.getItem('user'));
    }
  }

  async onSignIn(email:string,password:string) {
    await this.firebaseService.signIn(email,password);
    if(this.firebaseService.isLoggedIn){
      
      window.alert("Logged In");
      this.text="Signed In";
    }
    else{
      window.alert("Authentication Failed");
      console.log("Authentication Failed");
    }
  }

  
   getOTP(){
    

     signInWithPhoneNumber(this.auth,"+91"+this.phoneNumber,this.wndowRef.recaptchaVerifier)
    .then(res=>{
      localStorage.setItem('verificationId',JSON.stringify(res.verificationId));
      this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}');
      window.alert("OTP Sent Successfully"+res)
    }).catch(err=>{
      window.alert(err);
    });

  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  handleClick() {
    console.log(this.otp);
    var credential = PhoneAuthProvider.credential(
      this.verify,
      this.otp
    );

    
    signInWithCredential(this.auth,credential)
      .then((response) => {
        console.log(response);
        localStorage.setItem('user_data', JSON.stringify(response));
        console.log(localStorage.getItem('user_data'));
        localStorage.setItem('signIn',JSON.stringify("true"));
        $('.otp').hide();
        $('.contain').hide();
        $('.spinner').show();
        this.isSignedIn=true
       setTimeout(() => {
        this.router.navigate(['/service-nearby']);
        
       }, 2000);
       
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
      
  }
  async logout() {
    window.alert("User Logged Out");
    this.isSignedIn=false
    localStorage.clear();
  }
  loggedIn(){
    return localStorage.getItem('signIn');
  }
   



}

