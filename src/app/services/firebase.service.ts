import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword, getAuth,RecaptchaVerifier,signInWithPhoneNumber } from '@angular/fire/auth';
import { Firestore,collection,collectionData, doc, updateDoc, setDoc, docData, addDoc, where, query, documentId } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Blogs {
  title : string;
  description : string;
}

export interface Orders {
  address : Array<Map<string,string>>;
  customer_id : string;
  payment_id : string;
  phone: string;
  service: Map<string,any>;
  time:string;
}

export interface Providers {
  id: string;
  documentUploaded:string
  cities : Array<Map<string,string>>;
  name : string;
  phone: string;
  location: string;
  status:boolean;
  token:string;
  verified:boolean;
  services : Array<Map<any,any>>;
}

export interface SubServices {
  id: string
  eta : number;
  iconAvailable : string;
  name: string;
  price: number;
  providers:Array<string>;
  translations:Map<string,string>;
}

export interface Register {
  name : string;
  email : string;
  position : string;
  description : string;
}

export interface Users2 {
  addresses : Array<Map<string,string>>;
  name : string;
  phone: string;
  whatsAppNumber: string;
}

export interface Users {
  id: string;
  addresses : Array<Map<string,string>>;
  name : string;
  phone: string;
  whatsAppNumber: string;
}
export interface Services {
  id:string;
  about: Map<string,string>;
  bestData:Array<string>;
  cities:Array<string>;
  faq:Array<Map<string,string>>;
  howItWorks:Array<Map<string,string>>;
  iconAvailable:boolean;
  metaData:Array<string>;
  name:string;
  rank:number;
  subServices:Array<Map<string,string>>;
  title:string;
  translations:Array<string>;
  whyBook:string;
}
export interface Cities {
  name : string;
}
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  book: Blogs = { title: '', description: ''};
  isOtpLoggedIn=false;
isLoggedIn=false;
  constructor(public fireBaseAuth:Auth,public firestore:Firestore) { }
  async signIn(email:string,password:string){
    await signInWithEmailAndPassword(this.fireBaseAuth,email,password)
    .then(res=>{
      this.isLoggedIn=true;
      localStorage.setItem('user',JSON.stringify(res.user));
      console.log(res.user);
    });
  }
  async signUp(email:string,password:string){
    await createUserWithEmailAndPassword(this.fireBaseAuth,email,password)
    .then(res=>{
      this.isLoggedIn=true;
      localStorage.setItem('user',JSON.stringify(res.user))
    })
  }
  logout(){
    getAuth().signOut();
    localStorage.clear;
  }

  getBlogs() : Observable<Blogs[]>  { 
     return collectionData(collection(this.firestore,"blogs")) as Observable<Blogs[]>;
     
  }
  getCity(): Observable<Cities[]>  {
     return collectionData(collection(this.firestore,"cities")) as Observable<Cities[]>;
     
  }
  getServices():  Observable<Services[]>  {
     return collectionData(collection(this.firestore,"services"), { idField: 'id' }) as Observable<Services[]>;
  }
  getUsers(): Observable<Users[]> {
    return collectionData(collection(this.firestore,"users"), { idField: 'id' }) as Observable<Users[]>;
  }

  getSubServices(coll:string): Observable<SubServices[]>{
    return collectionData(collection(this.firestore,coll), { idField: 'id' }) as Observable<SubServices[]>;
  }

  getProviders(coll:string): Observable<Providers[]>{
    return collectionData(collection(this.firestore,coll), { idField: 'id' }) as Observable<Providers[]>;
  }

  modifyAddress(user:Users, address: Array<Map<string,string>>) {
    const bookDocRef = doc(this.firestore, 'users',user.id);

    updateDoc(bookDocRef, { addresses:address });
  }
  addDoc(register:Register,coll:string){
    const booksRef = collection(this.firestore, coll); 
    return addDoc(booksRef, register);
  }
  addDoc2(user:Users2,coll:string){
    const booksRef = collection(this.firestore, coll); 
    return addDoc(booksRef, user);
  }
  addDoc3(order:Orders,coll:string){
    const booksRef = collection(this.firestore, coll); 
    return addDoc(booksRef, order);
  }
}
