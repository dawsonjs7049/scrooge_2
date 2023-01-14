import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { WishlistItem } from '../interfaces/wishlistItem';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  constructor(private firebase : FirebaseService) {
    this.firebase.getAllWishlist().subscribe((response) => {
      this.wishlistData = this.calculateWishlistData(response);
    });
  }

  ngOnInit(): void {
  }

  wishlistData! : any[];


  // FIREBASE STUFF
  deleteWishlistItem = (id : string) => {
    this.firebase.deleteWishlistItem(id);
  }

  updateWishlistItem = (wishlistObject : any) => {
    let newFavorited = wishlistObject.isFavorited ? 0 : 1;
    let wishlistItem : WishlistItem = { name: wishlistObject.name, amount: wishlistObject.amount, isFavorited: newFavorited, id: wishlistObject.id };
  
    console.log("UPDATING ITEM - ORIGINAL: " + JSON.stringify(wishlistObject));
    console.log("UDPATING ITEM - NEW: " + JSON.stringify(wishlistItem));

    this.firebase.updateWishlistItem(wishlistItem);
  }

  // MISC FUNCTIONS
  calculateWishlistData = (data : any) => {
    let outArray : Object[] = [];

    data.forEach((item : any) => {
      outArray.push({ name: item.name, amount: item.amount, isFavorited: item.isFavorited, id: item.id });
    })

    // favorites should show up on top
    outArray.sort((a : any, b : any) => b.isFavorited - a.isFavorited);

    return outArray;

  }

}
