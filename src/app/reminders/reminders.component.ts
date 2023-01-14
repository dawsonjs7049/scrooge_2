import { Component, OnInit, TemplateRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { Reminder } from '../interfaces/reminder';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  constructor(private firebase : FirebaseService) {
    this.firebase.getAllReminders().subscribe((response : any) => {
      this.calculateRemindersData(response);
    });
  }

  ngOnInit(): void {
  }

  // @Output()
  // soonChangeEmit : EventEmitter<number> = new EventEmitter<number>();

  remindersData! : any[];
  remindersDataSoon! : any[];

  // FIREBASE STUFF
  deleteReminder = (id : string) => {
    this.firebase.deleteReminder(id);
  }

  // MISC FUNCTIONS
  calculateRemindersData = (data : any) => {
    let allArray : Object[] = [];
    let date = new Date();
    let now : number = date.getTime();

    data.forEach((item : any) => {
      let date = new Date(item.timestamp).toLocaleDateString();
      allArray.push({ name: item.name, timestamp: item.timestamp, date: date, id: item.id });
    })

    // sort by newest
    allArray.sort((a : any, b : any) => a.timestamp - b.timestamp);

    // soon means within 1 week
    this.remindersDataSoon = allArray.filter((item : any) => {
      if(item.timestamp <= (now + 604800000))
      {
        return item;
      }
    })

    this.remindersData = allArray;

    // if(this.remindersDataSoon.length > 0)
    // {
    //   console.log("EMITTING: " + this.remindersDataSoon.length);
    //   this.soonChangeEmit.emit(this.remindersDataSoon.length);
    // }
  
  }

}
