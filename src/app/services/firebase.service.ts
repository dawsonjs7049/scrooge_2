import { Injectable } from '@angular/core';
import { addDoc, Firestore, collection, getDocs, doc, updateDoc, deleteDoc, CollectionReference, DocumentData, docData, collectionData} from '@angular/fire/firestore'
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { RecurringExpense } from '../interfaces/recurringExpense';
import { Budget } from '../interfaces/budget';
import { MonthlyExpense } from '../interfaces/monthlyExpense';
import { WishlistItem } from '../interfaces/wishlistItem';
import { Reminder } from '../interfaces/reminder';
import { Goal } from '../interfaces/goal';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {
    this.recurringCollection = collection(this.firestore, 'recurring');
    this.budgetCollection = collection(this.firestore, 'budget');
    this.monthlyCollection = collection(this.firestore, 'monthly');
    this.wishlistCollection = collection(this.firestore, 'wishlist');
    this.reminderCollection = collection(this.firestore, 'reminder');
    this.goalCollection = collection(this.firestore, 'goal');

  }

  private recurringCollection: CollectionReference<DocumentData>;
  private budgetCollection: CollectionReference<DocumentData>;
  private monthlyCollection: CollectionReference<DocumentData>;
  private wishlistCollection: CollectionReference<DocumentData>;
  private reminderCollection: CollectionReference<DocumentData>;
  private goalCollection: CollectionReference<DocumentData>;

  // RECURRING 
  getAll() {
    return collectionData(this.recurringCollection, {
      idField: 'id',
    }) as Observable<RecurringExpense[]>;
  }

  get(id: string) {
    const recurringDocRef = doc(this.firestore, `recurring/${id}`);
    return docData(recurringDocRef, { idField: 'id' });
  }

  create(recurringExpense: RecurringExpense) {
    return addDoc(this.recurringCollection, recurringExpense);
  }

  // would normally pass whole RecurringExpense object, this is just for test
  update(id : string) {
    const recurringDocRef = doc(
      this.firestore,
      `recurring/${id}`
    );

    let recurringExpense : RecurringExpense = { name: 'updated 3', amount: 3, id: id };

    return updateDoc(recurringDocRef, { ...recurringExpense });
  }

  delete(id: string) {
    const recurringDocRef = doc(this.firestore, `recurring/${id}`);
    return deleteDoc(recurringDocRef);
  }

  // BUDGET TOTAL
  getBudget = () => {

    return collectionData(this.budgetCollection, {
      idField: 'id',
    }) as Observable<Budget[]>;

  }

  updateBudget = (budget : Budget) => {

    const dbBudget = collection(this.firestore, 'budget');
    getDocs(dbBudget)
      .then((response) => {
        response.docs.map((item) => {

          let budgetDocRef = doc(this.firestore, `budget/${item.id}`);
          deleteDoc(budgetDocRef);
        });
    
      }).finally(() => {
        let newBudget = { amount : budget.amount }
        addDoc(this.budgetCollection, newBudget);
      })
  }

  // MONTHLY
  getAllMonthly = () => {
    return collectionData(this.monthlyCollection, {
      idField: 'id',
    }) as Observable<MonthlyExpense[]>;
  }

  addMonthly = (monthlyExpense : MonthlyExpense) => {
    console.log("ADDING MONTHLY: " + JSON.stringify(monthlyExpense));
    return addDoc(this.monthlyCollection, monthlyExpense);
  }

  deleteMonthly = (id : string) => {
    const monthlyDocRef = doc(this.firestore, `monthly/${id}`);
    return deleteDoc(monthlyDocRef);
  }

  // WISHLIST
  getAllWishlist = () => {
    return collectionData(this.wishlistCollection, {
      idField: 'id',
    }) as Observable<WishlistItem[]>;
  }

  addWishlistItem = (wishlistItem : WishlistItem) => {
    console.log("ADDING WISHLIST: " + JSON.stringify(wishlistItem));
    return addDoc(this.wishlistCollection, wishlistItem);
  }

  deleteWishlistItem = (id : string) => {
    const wishlistDocRef = doc(this.firestore, `wishlist/${id}`);
    return deleteDoc(wishlistDocRef);
  }

  updateWishlistItem = (wishlistItem : WishlistItem) => {
    const wishlistDocRef = doc(
      this.firestore,
      `wishlist/${wishlistItem.id}`
    );

    return updateDoc(wishlistDocRef, { ...wishlistItem });
  }

  // REMINDERS
  getAllReminders = () => {
    return collectionData(this.reminderCollection, {
      idField: 'id',
    }) as Observable<Reminder[]>;
  }

  addReminder = (reminder : Reminder) => {
    console.log("ADDING REMINDER: " + JSON.stringify(reminder));
    return addDoc(this.reminderCollection, reminder);
  }

  deleteReminder = (id : string) => {
    const reminderDocRef = doc(this.firestore, `reminder/${id}`);
    return deleteDoc(reminderDocRef);
  }

  // GOALS
  getAllGoals = () => {
    return collectionData(this.goalCollection, {
      idField: 'id',
    }) as Observable<Goal[]>;
  }

  addGoal = (goal : Goal) => {
    console.log("ADDING GOAL: " + JSON.stringify(goal));
    return addDoc(this.goalCollection, goal);
  }

  deleteGoal = (id : string) => {
    const goalDocRef = doc(this.firestore, `goal/${id}`);
    return deleteDoc(goalDocRef);
  }



//   getAllRecurring = () => {
//     // return this.afs.collection('/recurring').snapshotChanges();
//   }

//   getRecurring = () => {
//     let toReturn;
//     const dbRecurring = collection(this.firestore, 'recurring');
//     getDocs(dbRecurring)
//       .then((response) => {
//         response.docs.map((item) => {
//           toReturn = { ...item.data(), id: item.id };
//           console.log("TO RETURN: " + console.log(toReturn));
//           return { ...item.data(), id: item.id }
//         });
    
//       })

//   }

//     // firebase functionns
// addRecurring = (form : any) => {
//   const { value } = form;
//   console.log("ADD VALUE: " + JSON.stringify(value));

//   const dbRecurring = collection(this.firestore, 'recurring');
//   addDoc(dbRecurring, value)
//     .then(() => {
//       console.log("SENT");
//     })
//     .catch((err) => {
//       console.log("ERROR: " + err);
//     })
// }

// deleteRecurring = (id : string) => {
//   const toDelete = doc(this.firestore, 'recurring', id);
//   deleteDoc(toDelete)
//     .then(() => {
//       console.log("DELETED");
//     })
//     .catch((err) => {
//       console.log("ERROR: " + err);
//     })
// }

// updateRecurring = (id : string) => {
//   const toUpdate = doc(this.firestore, 'recurring', id);
//   updateDoc(toUpdate, {
//     name: 'updating...'
//   })
//   .then(() => {
//     console.log("UPDATED");
//     // could call get data again to refresh manually
//   })
//   .catch((err) => {
//     console.log("ERROR: " + err);
//   })
// }
}
