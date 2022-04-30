import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { getStorage,ref,getDownloadURL } from '@angular/fire/storage';
import { FirebaseService, Services } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-nearby',
  templateUrl: './service-nearby.component.html',
  styleUrls: ['./service-nearby.component.css']
})

export class ServiceNearbyComponent implements OnInit {
  services:Services[]=[];
  icon = [] as any;
  id:string='';
  storage=getStorage();
  constructor(public firebaseService:FirebaseService,private router:Router) { }

  ngOnInit(): void {
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
    window.scrollTo(100, 100)
  }
  getId(id1:string){
  this.id=id1;
  localStorage.removeItem('id');
  localStorage.setItem('id',JSON.stringify(id1));
  this.router.navigate(['/services']);
  }
}
