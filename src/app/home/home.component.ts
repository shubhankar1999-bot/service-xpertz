import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit,AfterViewInit} from '@angular/core';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cities, FirebaseService, Services,Register } from '../services/firebase.service';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
@Injectable()
export class HomeComponent implements OnInit {
  registerForm!: FormGroup;
  buyForm!: FormGroup;
  private lat:number;private lng:number;
  cities: Cities[]=[];
  temp!: string;
  services:Services[]=[];
  subservices = [] as any;
  icon = [] as any;
  id:string='';
  storage=getStorage();
  constructor(private http: HttpClient,public firebaseService:FirebaseService,public formBuilder: FormBuilder,private router:Router) { 
    this.lat=0;
    this.lng=0;
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required]],
      position: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.buyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.required]],
      service: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.getUserLocation();
    this.firebaseService.getCity().subscribe((res: Cities[]) => {
      this.cities = res;
      console.log(this.cities);
    })
    this.firebaseService.getServices().subscribe((res: Services[]) => {
      this.services = res;
      console.log(this.services)
      for (let index = 0; index < this.services.length; index++) {
        if((this.services)[index].iconAvailable){
          const ref1 = ref(this.storage,'services/'+(this.services)[index].id+'/logo/');
           getDownloadURL(ref1).then((res:string)=>{
            this.icon.push({
              'url':res,
              'name':this.services[index].name,
              'id':this.services[index].id,
            },
            );
          })
        }
      }
      console.log(this.icon)
    })

      $('#collapseExample').on('shown.bs.collapse', function(){
        $('#repair').css('top','5300px');
      });
      $('#collapseExample').on('hidden.bs.collapse', function(){
        $('#repair').css('top','1200px');
      });
  }

  ngAfterViewInit(){
    this.getSubServices()
  }

  get getControl(){
    return this.registerForm.controls;
  }
  get getControl2(){
    return this.buyForm.controls;
  }
  getUserLocation() {
    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(position => {
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
       });
       this.callApi(this.lat,this.lng);
 }else {
    console.log("User not allow")

 }
}
callApi(Longitude: number, Latitude: number){
  const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${Latitude}%2C${Longitude}`
  const data=this.http.get(url);
  console.log(data);
  //Call API
}
onSubmit(){
  console.log(this.registerForm.value)
  this.firebaseService.addDoc(this.registerForm.value,'userRegistered').
      then(() => this.registerForm.reset());
}
onSubmit2(){
  console.log(this.buyForm.value)
  this.firebaseService.addDoc(this.buyForm.value,'scheduleService').
      then(() => this.buyForm.reset());
}

getSubServices(){
  this.subservices=[]
  this.temp=$( "#myselect option:selected" ).text();
  this.firebaseService.getServices().subscribe((res: Services[]) => {
    this.services = res;
  for (let index = 0; index < this.services.length; index++) {
    if(this.temp.toString() == this.services[index].name){
      for (let index2 = 0; index2 < (this.services[index].subServices).length; index2++) {
        this.subservices.push({
          newService:(this.services[index]).subServices[index2],
        });
      }
  }
  }
});
  console.log(this.subservices)
  console.log(this.temp)

}

getId(id1:string){
  this.id=id1;
  localStorage.removeItem('id');
  localStorage.setItem('id',JSON.stringify(id1));
  this.router.navigate(['/services']);
  }

}
//AAPK950e7948b8c54ba0855480fb857cfbecfJQCV1fKcYM8JDfmsuJJiYUnAzrwU1fQYxmoBX37uetwK6SARQdJ9TwoWeoODG8i