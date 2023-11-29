import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, map, tap } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesStoreService {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
  ) {
    this.loadAllCourse();
  }

  private loadAllCourse() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(res => res['payload']),
        catchError((error) => {
          const message = "Could Not Load Courses"
          this.messagesService.showErrors(message)
          return throwError(message);
        }),
        tap(courses => this.subject.next(courses))
      );
    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses =>
        courses.filter(course => course.category == category)
          .sort(sortCoursesBySeqNo))
    )
  }
}
