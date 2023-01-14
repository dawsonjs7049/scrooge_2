import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { MonthlyExpense } from '../interfaces/monthlyExpense';
import { Observable } from 'rxjs';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.css']
})
export class MonthlyComponent implements OnInit {

  constructor(private toastr : ToastrService, private firebase : FirebaseService, private modalService : NgbModal, private formBuilder : FormBuilder) { 
    
    this.monthlyForm = this.formBuilder.group({
      name : ['', Validators.required],
      amount : ['', Validators.required]
    });

    this.firebase.getAllMonthly().subscribe((response) => {
        this.monthlyData = this.calculateMonthlyData(response);
    })

    this.monthName = this.monthNames[new Date().getMonth()];
  }

  ngOnInit(): void {
  }

  monthlyForm! : FormGroup;
  closeResult = '';
  monthlyAmount : number = 0;
  monthlyDescription : string = '';

  monthlyData! : any[];
  monthlyTotal : number = 0;
  monthName : string = '';

  monthNames = [
    "January",
    "February",
    "March", 
    "April", 
    "May", 
    "June",
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
  ];


  // FIREBASE STUFF
  addMonthly = () => {
    const { value } = this.monthlyForm;
    value.date = Date.now();

    this.firebase.addMonthly(value);

    this.showSuccessToast("Added Expense... did you really need that?? 😡");

    this.modalService.dismissAll();
  }

  deleteMonthly = (id : string) => {
    this.firebase.deleteMonthly(id);

    this.showWarnToast("Deleted Expense... that's what we like to see 😌");
  }

  // MISC FUNCTIONS
  calculateMonthlyData = (data : any) => {
    let total : number = 0;
    let outArray : Object[] = [];

    // get first day of this month
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    
    data.forEach((item : any) => {

      // get only expenses since the start of this month
      if(item.date > firstDay)
      {
        total += item.amount;
        outArray.push({ name: item.name, amount: item.amount, id: item.id, date: item.date });  
      }

     });

    // sort array by newest first
    outArray.sort((a : any, b : any) => parseFloat(b.date) - parseFloat(a.date));

    this.monthlyTotal = total;

    return outArray;
  }

  showSuccessToast = (message : string) => {
    this.toastr.success(message, '', {
      positionClass: 'toast-bottom-center',
      progressBar : true
    });
  }
  
  showWarnToast = (message : string) => {
    this.toastr.warning(message, '', {
      positionClass: 'toast-bottom-center',
      progressBar : true
    });
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
