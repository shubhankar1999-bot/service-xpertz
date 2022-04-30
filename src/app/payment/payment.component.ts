import { Component, OnInit,AfterViewInit,OnDestroy, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FirebaseService, Users,Orders } from '../services/firebase.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
declare var $:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  userId='' as any;
  receipt='' as any;
  order=[] as any;
  userForm!: FormGroup;
  myDatePicker:any;
  users: Users[]=[];
  mem = [] as any;
  addr = {} as any;
  phon = '1' as any;
  user1!: Users;
  constructor(private auth: AuthService,public formBuilder: FormBuilder,public firebaseService:FirebaseService,private router:Router,private zone:NgZone) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      line1: ['', [Validators.required, Validators.minLength(10)]],
      line2: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      pincode: ['', [Validators.required]],
    })
    $('.outer').show();
    $('.select-date').hide();
    this.firebaseService.getUsers().subscribe((res: Users[]) => {
      this.users = res;
      
      if(localStorage.getItem('user_data')!= null ){
        this.mem = localStorage.getItem('user_data')
      console.log(JSON.parse(this.mem).user.phoneNumber)
      for (let index = 0; index < this.users.length; index++) {
        
          if(JSON.parse(this.mem).user.phoneNumber == this.users[index].phone){
            this.phon=JSON.parse(this.mem).user.phoneNumber;
            this.userId=this.users[index].id;
            console.log("Yes")
            if(this.users[index] != null){
            this.addr = this.users[index].addresses;
            this.updateForm();
            this.user1=this.users[index]
            }
          }
        
        
      }
    }
    else{
    }
    })

    
  }
  ngAfterViewInit(): void{
    $('.outer').show();
    $('.select-date').hide();
  }
  get getControl(){
    return this.userForm.controls;
  }
  
  onSubmit(){
    console.log(this.userForm.value)
    if(localStorage.getItem('user_data')!= null){
    
    if((this.userForm.get('line1')?.value !='') || (this.userForm.get('line2')?.value !='') || (this.userForm.get('city')?.value !='') || (this.userForm.get('state')?.value !='') || (this.userForm.get('country')?.value !='') || (this.userForm.get('pincode')?.value !='')){
      $('.select-date').show();
    $('.outer').hide();
      if(this.phon!=1){
        this.firebaseService.modifyAddress(this.user1, Array(this.userForm.value))
      }
      else{
        const x={
          addresses:Array(this.userForm.value),
          name:'',
          phone:JSON.parse(this.mem).user.phoneNumber,
          whatsAppNumber:JSON.parse(this.mem).user.phoneNumber,
        }
        this.firebaseService.addDoc2(x,'users')
      }
      
      }
      else{
        window.alert("Please fill in the fields")
      }
    }
    else{
      $('#staticBackdrop').modal('show');   
    }
  }

  updateForm(){
    if(this.addr!=null){
    this.userForm.setValue({
      line1:this.addr[0].line1,
      line2:this.addr[0].line2,
      city:this.addr[0].city,
      state:this.addr[0].state,
      country:this.addr[0].country,
      pincode:this.addr[0].pincode,
    })
  }
  else{
    this.userForm.setValue({
      line1:'',
      line2:'',
      city:'',
      state:'',
      country:'',
      pincode:'',
    })
  }
  }
  changeAddr(){
    $('.outer').show();
    $('.select-date').hide();
  }

  routeLogin(){
    this.router.navigate(['/login']);
  }
  

   options = {
    "key": "rzp_test_jSkM3KoBE5MBUv", // Enter the Key ID generated from the Dashboard
    "amount": "100", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Acme Corp",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "handler":this.paymentHandler.bind(this),
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    'modal':{
      ondismiss: (()=>{
        this.zone.run(()=>{

        });
      })
    },
    "theme": {
        "color": "#3399cc"
    }
};

pay(){
  if(this.myDatePicker){
    
  
  this.order.push(JSON.parse(localStorage.getItem('service_name')!),JSON.parse(localStorage.getItem('price')!))
  this.options.amount=(JSON.parse(localStorage.getItem('price')!)*100).toString()
  
  this.options.prefill.contact=JSON.parse(this.mem).user.phoneNumber
  let rzp1 = new this.auth.nativeWindow.Razorpay(this.options);
  rzp1.open();
  }
  else{
    window.alert("Select Date To Proceed")
  }
}

pay2(){
  if(this.myDatePicker){
    this.order.push(JSON.parse(localStorage.getItem('service_name')!),JSON.parse(localStorage.getItem('price')!))
  this.options.amount=(JSON.parse(localStorage.getItem('price')!)*100).toString()
    this.receipt=uuid();
  const services2:(Map<string,string> | any) =   {
    service_id:String(JSON.parse(localStorage.getItem('service_id')!)),
    charge: Number(JSON.parse(localStorage.getItem('price')!)),
    sub_service_id:String(JSON.parse(localStorage.getItem('subservice_id')!)),
  }
  const y = {
    phone:JSON.parse(this.mem).user.phoneNumber,
    address:Array(this.userForm.value),
    service:services2,
    time:this.myDatePicker,
    payment_id:this.receipt,
    customer_id:this.userId,
    //restaurant_id
  }
  $('#staticBackdrop2').modal('show');

  this.firebaseService.addDoc3(y,'orders')
}
else{
  window.alert("Select Date To Proceed")
}
}

paymentHandler(res:any){
  console.log(res)
  this.receipt=res.razorpay_payment_id;
   const services2:(Map<string,string> | any) =   {
    service_id:String(JSON.parse(localStorage.getItem('service_id')!)),
    charge: Number(JSON.parse(localStorage.getItem('price')!)),
    sub_service_id:String(JSON.parse(localStorage.getItem('subservice_id')!)),
  }
  const y = {
    phone:JSON.parse(this.mem).user.phoneNumber,
    address:Array(this.userForm.value),
    service:services2,
    time:this.myDatePicker,
    payment_id:res.razorpay_payment_id,
    customer_id:this.userId,
  }
  $('#staticBackdrop2').modal('show');

  this.firebaseService.addDoc3(y,'orders')

  
this.zone.run(()=>{

});
}

}
