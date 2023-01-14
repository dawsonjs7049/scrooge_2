import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { PercentPipe } from '@angular/common';
import { Goal } from '../interfaces/goal';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {

  constructor(private firebase : FirebaseService, private modalService : NgbModal, private formBuilder : FormBuilder) { 
    this.goalForm = this.formBuilder.group({
      name : ['', Validators.required],
      target : ['', Validators.required],
      date : ['', Validators.required]
    });

    this.firebase.getAllGoals().subscribe((response) => {
      this.goalData = this.calculateGoals(response);
  })
  }

  ngOnInit(): void {
  }

  goalForm! : FormGroup;
  goalData! : any[];
  monthlyValue : number = 0;
  closeResult = '';

  calculateGoals = (data : any) => {
    let outArray : Object[] = [];

    data.forEach((item : any) => {

      let monthDifference : number = this.getMonthDifference(item.goalStart, new Date().getTime());
      let savedSoFar : number = monthDifference * item.monthlyAmount;
      let percent : number = (savedSoFar / item.totalAmount) * 100;

      if(savedSoFar > item.totalAmount)
      {
        // goal has been completed
        savedSoFar = item.totalAmount;
        percent = 100;
      }

      outArray.push({ 
        name : item.name,
        goalTotal : item.totalAmount,
        goalMonthly : item.monthlyAmount,
        goalStart : item.goalStart,
        goalEnd : item.goalEnd,
        goalStartFormatted : this.getFormattedDate(new Date(item.goalStart)),
        goalEndFormatted : this.getFormattedDate(new Date(item.goalEnd)),
        percent : percent,
        saved : savedSoFar,
        id : item.id
      });
    });

    // want goals that are ending earlier to be first
    outArray.sort((a : any, b : any) => a.goalEnd - b.goalEnd);

    return outArray;
  }

  handleMonthlyCalc = () => {

    const { value } = this.goalForm;

    let target : number = value.target;
    let date : string = value.date;

    if( (target && target != 0) && (date && date !== '') )
    {
      let goalTimestamp = new Date(date).getTime();
      let todayTimestamp = new Date().getTime();

      let monthDiff = this.getMonthDifference(todayTimestamp, goalTimestamp);

      if(target > 0)
      {
        this.monthlyValue = parseFloat((target / monthDiff).toFixed(0));
      }
    }
}

  getMonthDifference = (startDate : number, endDate : number) => {

    // this gets accurate dates accounting for timezone stuff
    let dateStart = new Date(startDate).toLocaleDateString();
    let dateEnd = new Date(endDate).toLocaleDateString();

    console.log("DATE START: " + dateStart + " - DATE END: " + dateEnd);

    let start = this.getFormattedDateObject(dateStart);
    let end = this.getFormattedDateObject(dateEnd);

    console.log("IN GET MONTH DIFFERENCE - START: " + start.toLocaleDateString() + " - END: " + end.toLocaleDateString());
    return (
      end.getMonth() -
      start.getMonth() +
      12 * (end.getFullYear() - start.getFullYear())
    );
  }

  getFormattedDate = (date : any) => {
    return new Date(date.toLocaleDateString() + " 16:00:00").toLocaleDateString(undefined, {
        day:   '2-digit',
        month: '2-digit',
        year:  'numeric',
    });
  }

  getFormattedDateObject = (date : any) => {
    return new Date(date + " 16:00:00");
  }

  // firebase
  addGoal = () => {
    const { value } = this.goalForm;

    if( (value.name != '') && (value.target > 0) && (value.date != '') && (this.monthlyValue > 0) )
    {

      value.totalAmount = value.target;
      value.monthlyAmount = this.monthlyValue;
      value.goalStart = new Date().getTime();
      value.goalEnd = new Date(this.getFormattedDateObject(value.date)).getTime();
  
      this.firebase.addGoal(value);
    }
  }

  deleteGoal = (id : string) => {
    this.firebase.deleteGoal(id);
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log("CLOSE RESULT: " + this.closeResult);
    })
  };

  getDismissReason(reason:any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
