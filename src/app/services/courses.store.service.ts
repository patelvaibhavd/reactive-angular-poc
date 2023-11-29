import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
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

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses: Course[] = this.subject.getValue();
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse = {
      ...courses[index],
      ...changes
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.subject.next(newCourses);
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((error) => {
        const message = "Could not save course";
        console.log(error);
        this.messagesService.showErrors(message);
        return throwError(error);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses =>
        courses.filter(course => course.category == category)
          .sort(sortCoursesBySeqNo))
    )
  }
}
