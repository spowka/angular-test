import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out',
          style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in',
          style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class AutocompleteInputComponent implements OnInit {
  public searchString: FormControl;
  public autocompleteList$: Observable<any>;

  private unsubscribe$ = new Subject<void>();

  constructor(public fb: FormBuilder, private autocompleteService: AutocompleteService) {
    this.searchString = this.fb.control('', Validators.required);
    this.autocompleteList$ = this.autocompleteService.filteredOptions$;
  }

  ngOnInit(): void {
    this.searchString.valueChanges.pipe(takeUntil(this.unsubscribe$), debounceTime(200)).subscribe(value => {
      if (!value.trim()) {
        return this.autocompleteService.resetSearch();
      }

      this.autocompleteService.getNames(value).subscribe();
    })
  }

  select(name: string) {
    this.searchString.patchValue(name);
  }

  alert() {
    if (this.searchString.invalid) {
      return;
    }

    alert(this.searchString.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
