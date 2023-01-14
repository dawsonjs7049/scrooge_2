import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDoc, Firestore, collection, getDocs, doc, updateDoc, deleteDoc, collectionSnapshots, collectionChanges, query, collectionData} from '@angular/fire/firestore'
import { RecurringExpense } from './interfaces/recurringExpense';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService, private auth : Auth, private formBuilder : FormBuilder, private modalService : NgbModal, private firestore: Firestore)
  {
    this.recurringForm = this.formBuilder.group({
      name : ['', Validators.required],
      amount : ['', Validators.required]
    })

    // this.getRecurring();

  }

  recurring : any = [];

  title = 'Scrooge';

  recurringForm! : FormGroup;
  closeResult = '';
  recurringAmount : number = 0;
  recurringDescription : string = '';

  email : string = '';
  password : string = '';

  handleSubmit = () => {
    console.log("email: " + this.email);
    console.log("password: " + this.password);
    this.authService.login(this.email, this.password);

    // signInWithEmailAndPassword(this.auth, this.email, this.password)
    //   .then((response : any) => {
    //     console.log("USER: " + response.user);
    //   })
    //   .catch((err) => {
    //     console.log("ERROR: " + err);
    //   })
  }

  isLoading = () => {
    this.authService.isLoading;
  }






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


}
