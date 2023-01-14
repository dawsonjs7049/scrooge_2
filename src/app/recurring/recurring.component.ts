import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { RecurringExpense } from '../interfaces/recurringExpense';
import { Observable } from 'rxjs';
import { ScaleType, Color, LegendPosition } from '@swimlane/ngx-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.css']
})
export class RecurringComponent implements OnInit {

  constructor(private toastr : ToastrService, private firebase : FirebaseService, private modalService : NgbModal, private formBuilder : FormBuilder) { 

    this.recurring = this.firebase.getAll();
    const recurringSub = this.recurring.subscribe((response) => {
      this.rawRecurring = response;
      this.pieData = this.calculateRecurring(response);
    })

    this.firebase.getBudget().subscribe(res => {
      // get budget and then use last saved response from getAll recurring to recalculate pie chart/expenses list
      this.budget = this.calculateBudget(res);
      this.pieData = this.calculateRecurring(this.rawRecurring);
    });

    this.recurringForm = this.formBuilder.group({
      name : ['', Validators.required],
      amount : ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  recurringForm! : FormGroup;
  closeResult = '';
  recurringAmount : number = 0;
  recurringDescription : string = '';

  rawRecurring : RecurringExpense[] = [];
  recurring: Observable<RecurringExpense[]>;
  pieData : any[] = [];

  budget : number = 0;
  budgetFree : number = 0;

  // FIREBASE STUFF
  addRecurring = () => {
    const { value } = this.recurringForm;

    this.firebase.create(value);

    this.showSuccessToast("Added Recurring Expense!");

    this.modalService.dismissAll();
  }

  deleteRecurring = (id : string) => {
    this.firebase.delete(id);

    this.showWarnToast("Deleted Recurring Expense");
  }

  calculateBudget(input : any) : number {
    let myBudget = 0;
    input.forEach((item : any) => {
      myBudget = item.amount;
    });

    return myBudget;
  }

  calculateRecurring(input : any) {
    let total : number = 0;
    let outArray : Object[] = [];
    
    input.forEach((item : any) => {
      total += item.amount;
      outArray.push({ name: item.name, value: item.amount, id: item.id });
    });

    outArray.sort((a : any, b : any) => parseFloat(b.value) - parseFloat(a.value) );

    this.budgetFree = this.budget - total;

    outArray.push({ name: 'Free', value: this.budgetFree });

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

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  colorScheme: Color = {
    name: 'pieScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', 'AAAAAA'],
  };

  below = LegendPosition.Below

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
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
