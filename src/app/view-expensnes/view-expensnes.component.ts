import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-expensnes',
  templateUrl: './view-expensnes.component.html',
  styleUrls: ['./view-expensnes.component.css']
})
export class ViewExpensnesComponent implements OnInit {

  constructor(private firebase : FirebaseService, private modalService : NgbModal, private formBuilder : FormBuilder) { 
    
    this.viewExpenseForm = this.formBuilder.group({
      date : ['', Validators.required]
    });

    this.firebase.getAllMonthly().subscribe((response) => {
        this.calculateMonthlyData(response);
    })

  }

  ngOnInit(): void {
  }

  viewExpenseForm! : FormGroup;
  closeResult = '';
  viewDate : string = '';

  // monthly!: Observable<MonthlyExpense[]>;
  allExpenses! : any[];
  viewableExpenses! : any[];

  // MISC FUNCTIONS
  calculateMonthlyData = (data : any) => {
    let outArray : Object[] = [];

    data.forEach((item : any) => {
      let date = new Date(item.date).toLocaleDateString();
      outArray.push({ name: item.name, amount: item.amount, date: date, timestamp: item.date });
    });

    // sort array by newest first
    outArray.sort((a : any, b : any) => parseFloat(a.timestamp) - parseFloat(b.timestamp));

    this.allExpenses = outArray;
    this.viewableExpenses = outArray;
    
  }

  calculateViewable = () => {
    const { value } = this.viewExpenseForm;
    let date = value.date;

    let calcTimestamp = new Date(date).getTime();
    console.log("CALC TIMESTAMP: " + calcTimestamp);

    let outArray = this.allExpenses.filter((item : any) => {
      if(item.timestamp > calcTimestamp)
      {
        return item;
      }
    })

    this.viewableExpenses = outArray;
  }
  

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
