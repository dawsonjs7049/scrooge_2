import { Component, OnInit, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { addDoc, Firestore, collection, getDocs, doc, updateDoc, deleteDoc, collectionSnapshots, collectionChanges, query, collectionData} from '@angular/fire/firestore'
import { RecurringExpense } from '../interfaces/recurringExpense';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  recurring: Observable<RecurringExpense[]>;

  constructor(private toastr: ToastrService, private offcanvasService: NgbOffcanvas, private auth: AuthService, private modalService : NgbModal, private formBuilder : FormBuilder, private firestore: Firestore, private firebase : FirebaseService) { 

    this.recurringForm = this.formBuilder.group({
      name : ['', Validators.required],
      amount : ['', Validators.required]
    });

    this.budgetForm = this.formBuilder.group({
      amount : ['', Validators.required]
    });

    this.wishlistForm = this.formBuilder.group({
      name : ['', Validators.required],
      amount : ['', Validators.required]
    });

    this.reminderForm = this.formBuilder.group({
      name : ['', Validators.required],
      timestamp : ['', Validators.required]
    })

    this.recurring = this.firebase.getAll();

    // need to get the number of soon reminders (can't emit current amount until we open the reminders component otherwise)
    this.firebase.getAllReminders().subscribe((response : any) => {
      this.numSoonReminders = 0;
      let date = new Date();
      let now : number = date.getTime();

      response.forEach((item : any) => {
        if(item.timestamp <= (now + 604800000))
        {
          this.numSoonReminders++;
        }
      })

      if(this.numSoonReminders > 0)
      {
        this.showInfoToast("You have " + this.numSoonReminders + " upcoming reminders!");
      }
    });

  }

  ngOnInit(): void {
  }

  // firebase functions
  addRecurring = () => {
    // const { value } = this.recurringForm;

    // this.firebase.create(value);

    // this.showSuccessToast("Added Recurring Expense!");
  }

  addWishlistItem = () => {
    const { value } = this.wishlistForm;
    value.isFavorited = 0;
   
    this.firebase.addWishlistItem(value);

    this.showSuccessToast("Added Wishlist Item!");
  }

  addReminder = () => {
    const { value } = this.reminderForm;

    const formatted = new Date(value.timestamp + " 16:00:00").toLocaleDateString(undefined, {
      day:   '2-digit',
      month: '2-digit',
      year:  'numeric',
    });

    // this gives us a timestamp that accounts for timezone differences
    const timestamp = new Date(formatted).getTime();

    value.timestamp = timestamp;

    this.firebase.addReminder(value);
    
    this.showSuccessToast("Added Reminder!");
  }

  updateBudget = () => {
    const { value } = this.budgetForm;

    this.firebase.updateBudget(value);

    this.showSuccessToast("Updated Budget to $" + value.amount);

    this.modalService.dismissAll();

  }

  showSuccessToast = (message : string) => {
    this.toastr.success(message, '', {
      positionClass: 'toast-bottom-center',
      progressBar : true
    });
  }

  showInfoToast = (message : string) => {
    this.toastr.info(message, '', {
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

  recurringForm! : FormGroup;
  budgetForm! : FormGroup;
  wishlistForm! : FormGroup;
  reminderForm! : FormGroup;

  numSoonReminders: number = 0;
  budgetAmount : number = 0;

  closeResult = '';
  recurringAmount : number = 0;
  recurringDescription : string = '';

  wishlistName : string = '';
  wishlistAmount : number = 0;

  openScroll(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  openLeft(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'start' });
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })};

  getDismissReason(reason:any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return `with: ${reason}`;
      }
    }


  handleBudgetShow = () => {

  }

  toggleShowWishlist = () => {

  }

  toggleShowReminders = () => {

  }

  toggleShowGoals = () => {

  }

  logout = () => {
    this.auth.logout();
  }
}

