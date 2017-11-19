import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  names: KidName[] = [];
  allNames: KidName[] = [];
  newItemForm: FormGroup;
  submitted = false;
  currentPageNumber = 0;
  Arr = Array;

  constructor(private fb: FormBuilder, private http: Http) {
    this.createForm();
  }

  get totalNumberOfPages() {
    return Math.ceil(this.allNames.length / 10);
  }

  createForm() {
    this.newItemForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.http.get(environment.apiUrl + 'names')
      .map(c => c.json())
      .subscribe(names => {
        this.allNames = names;
        this.names = this.sortVotes(this.allNames);
      });
  }

  sortVotes(votes: KidName[]) {
    let sortedVotes = votes.sort((a, b) => {
      if (a.votes < b.votes) {
        return 1;
      } else if (a.votes > b.votes) {
        return -1;
      } else { return 0; }
    });

    const startIndex = this.currentPageNumber * 10;
    const endIndex = startIndex + 10;
    sortedVotes = sortedVotes.slice(startIndex, endIndex);

    return sortedVotes;
  }

  selectPage(pageNumber: number) {
    if (pageNumber < 0) { pageNumber = 0; }

    this.currentPageNumber = pageNumber;
    this.names = this.sortVotes(this.allNames);
  }

  upVote(item: KidName) {
    item.votes += 1;

    const url = `${environment.apiUrl}names/${item._id}/up-vote`;

    this.http.put(url, {}).subscribe(c => {
      console.log('upvoted ' + item.name);
    });
  }

  downVote(item: KidName) {
    item.votes -= 1;

    const url = `${environment.apiUrl}names/${item._id}/down-vote`;

    this.http.put(url, {}).subscribe(c => {
      console.log('downvoted ' + item.name);
    });
  }

  submitNewName() {
    this.submitted = true;

    if (!this.newItemForm.valid) {
      return;
    }

    const url = `${environment.apiUrl}names`;

    const newVote: KidName = { name: this.newItemForm.value.name, votes: 1 };

    this.http.post(url, newVote).map(c => c.json()).subscribe(c => {
      newVote._id = c._id;
      this.allNames = [...this.allNames, newVote];

      this.names = this.sortVotes(this.allNames);

      this.submitted = false;
      this.newItemForm.setValue({ name: '' });
    });
  }
}

export interface KidName {
  _id?: string;
  votes: number;
  name: string;
}
