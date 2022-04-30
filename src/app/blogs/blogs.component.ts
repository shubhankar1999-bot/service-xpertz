import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blogs, FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: Blogs[]=[];
  constructor(public firebaseService:FirebaseService,private router:Router) { }

  ngOnInit(): void {
    this.firebaseService.getBlogs().subscribe((res: Blogs[]) => {
      this.blogs = res;
      console.log(this.blogs)
    })
  }

  onClick(q:number){
    this.router.navigate(['/blog-view']);
    localStorage.setItem('blog',q.toString());
  }

}
