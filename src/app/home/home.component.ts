import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStoreService } from '../services/courses.store.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    // private http: HttpClient,
    // private coursesService: CoursesService,
    // private loadingService: LoadingService,
    // private messagesService: MessagesService,
    private coursesStoreService: CoursesStoreService) {
  }

  ngOnInit() {
    this.reloadCourses()
  }

  reloadCourses() {
    // const courses$ = this.coursesService.loadAllCourses()
    //   .pipe(
    //     map((courses => courses.sort(sortCoursesBySeqNo))),
    //     catchError((error) => {
    //       const message = "Could Not Load Courses"
    //       this.messagesService.showErrors(message)
    //       console.log('err', error)
    //       return throwError(message);
    //     })
    //   );
    // const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    // this.beginnerCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category == "BEGINNER")))
    // this.advancedCourses$ = loadCourses$.pipe(map(courses => courses.filter(course => course.category == "ADVANCED")))
    this.beginnerCourses$ = this.coursesStoreService.filterByCategory("BEGINNER")
    this.advancedCourses$ = this.coursesStoreService.filterByCategory("ADVANCED")
  }
}




