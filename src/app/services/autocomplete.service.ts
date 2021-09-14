import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteService {
  private filtredOptionsSource$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  filteredOptions$ = this.filtredOptionsSource$.asObservable();

  constructor(private http: HttpClient) { }

  getNames(name: string): Observable<any> {
    return this.http.get(`https://restcountries.eu/rest/v2/name/${name}`).pipe(tap(data => {
      this.filtredOptionsSource$.next(data);
    }));
  }

  resetSearch() {
    this.filtredOptionsSource$.next([])
  }
}
