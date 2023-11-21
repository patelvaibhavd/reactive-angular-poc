import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class CoursesService {
    constructor(
        private http: HttpClient
    ) { }

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>('/api/courses')
            .pipe(
                map(res => res['payload'])
            );
    }

    // getCourses() {
    //     this.http.get('/api/courses')
    //     .subscribe(
    //       res => {
    //         const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);
    //         this.beginnerCourses = courses.filter(course => course.category == "BEGINNER");
    //         this.advancedCourses = courses.filter(course => course.category == "ADVANCED");
    //       });
    // }
}