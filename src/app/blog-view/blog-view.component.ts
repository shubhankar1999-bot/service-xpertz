import { Component, OnInit } from '@angular/core';
import { Blogs, FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit {
  blogs: Blogs[]=[];
  index!: number;
  constructor(public firebaseService:FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getBlogs().subscribe((res: Blogs[]) => {
      this.blogs = res;
      console.log(this.blogs)
    })
    const s =JSON.parse(localStorage.getItem('blog')!);
    this.index=parseInt(s)
    console.log(this.index)
  }

}
