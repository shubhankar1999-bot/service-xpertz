import { Component, OnInit } from '@angular/core';
import { getStorage,ref,getDownloadURL } from '@angular/fire/storage';
import { FirebaseService, Services,SubServices,Providers} from '../services/firebase.service';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  service_provider=[] as any;
  provider:Providers[]=[];
  services:Services[]=[];
  Subs: SubServices[]=[];
  subservices = [] as any;
  faqs = [] as any;
  id1:string | undefined;
  constructor(public firebaseService:FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getServices().subscribe((res: Services[]) => {
      this.services = res;
    this.id1=localStorage.getItem('id')?.toString();
    for (let index = 0; index < this.services.length; index++) {
      if(this.id1 == JSON.stringify(this.services[index].id)){
        localStorage.setItem('service_id',JSON.stringify(JSON.parse(this.id1)))
        //services/${this.id1}/subservices
        console.log(`services/${JSON.parse(this.id1)}/subservices`)
        this.firebaseService.getSubServices(`services/${JSON.parse(this.id1)}/subservices`).subscribe((res: SubServices[]) => {
          this.Subs = res;
          console.log(this.Subs)
          for (let index2 = 0; index2 < this.Subs.length; index2++) {
            this.subservices.push({
              newService:(this.Subs[index2]),
            });

            console.log(this.Subs[index2].providers[0].toString())
            
              this.firebaseService.getProviders('providers').subscribe((res2: Providers[])=>{
                this.provider=res2;
                for(let j=0;j<(this.Subs[index2].providers.length);j++){
                for(let k=0;k<this.provider.length;k++){
                  if(this.Subs[index2].providers[j]==this.provider[k].id){
                    const service_list = [] as any;
                    const nop :(Map<string,string> | any)=this.provider[k].services;
                    for(let l=0;l<nop.length;l++){
                      if(nop[l].sub_service_id==this.Subs[index2].id){
                        service_list.push({
                          service_name:this.Subs[index2].name,
                          price:this.Subs[index2].price
                        })
                      }
                    }
                    this.service_provider.push({
                      name:this.provider[k].name,
                      cities:this.provider[k].cities,
                      service:service_list
                    })
                    
                    //
                  }
                  //this.firebaseService.getSubServices(`services/${JSON.parse(this.provider[0].services[0].service_id)}/subservices`)
                }
              }
              })
              console.log(this.service_provider)
              
          
          }

            

        })
        for(let index2 = 0; index2 < (this.services[index].faq).length; index2++){
          this.faqs.push({
            faq: (this.services[index].faq[index2])
          })
        }
    }
    }

   

  console.log(this.subservices)
  console.log(this.faqs)
  });

  

  window.scrollTo(100, 100)
  }

  pay(price: number,id:string,service:string){
    localStorage.setItem('price',JSON.stringify(price))
    localStorage.setItem('service_name',JSON.stringify(service))
    localStorage.setItem('subservice_id',JSON.stringify(id))
  }

}
