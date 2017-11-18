import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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
    this.allNames = [
      { name: 'Peanut', votes: 100},
      { name: 'Gert', votes: 2},
      { name: 'Gert1', votes: 2},
      { name: 'Gert2', votes: 2},
      { name: 'Gert3', votes: 2},
      { name: 'Gert4', votes: 2},
      { name: 'Gert5', votes: 2},
      { name: 'Gert6', votes: 2},
      { name: 'Gert7', votes: 2},
      { name: 'Gert8', votes: 2},
      { name: 'Gert9', votes: 2},
      { name: 'Gert10', votes: 2},
      { name: 'Gert11', votes: 2},
      { name: 'Gert12', votes: 2},
      { name: 'Gert13', votes: 2},
      { name: 'Charlotte', votes: 200},
    ];

    this.names = this.sortVotes(this.allNames);
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
  }

  downVote(item: KidName) {
    item.votes -= 1;
  }

  submitNewName() {
    this.submitted = true;

    if (!this.newItemForm.valid) {
      return;
    }

    const newVote = {name: this.newItemForm.value.name, votes: 1};
    this.allNames = [...this.allNames, newVote];

    this.names = this.sortVotes(this.allNames);

    this.submitted = false;
    this.newItemForm.setValue({name: '' });
  }
}

export interface KidName {
  votes: number;
  name: string;
}
