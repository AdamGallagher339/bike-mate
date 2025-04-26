import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  doc,
} from '@angular/fire/firestore';

import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})
export class FollowingPage {
  firestore = inject(Firestore);
  auth = inject(Auth);
  alertCtrl = inject(AlertController);
  router = inject(Router);
  
  defaultProfile = 'https://www.gravatar.com/avatar?d=mp&s=200';

  usernameToFollow: string = '';
  followedUsers: any[] = [];

  async ionViewWillEnter() {
    await this.loadFollowedUsers();
  }

  async loadFollowedUsers() {
    const user = this.auth.currentUser;
    if (!user) return;

    const followsRef = collection(this.firestore, 'follows');
    const q = query(followsRef, where('followerId', '==', user.uid));
    const snapshot = await getDocs(q);

    const userIds = snapshot.docs.map(doc => doc.data()['followingId']);
    const usersRef = collection(this.firestore, 'users');
    const allUsersSnap = await getDocs(usersRef);

    this.followedUsers = allUsersSnap.docs
      .filter(doc => userIds.includes(doc.id))
      .map(doc => ({ ...doc.data(), uid: doc.id }));
  }

  async followUser() {
    const currentUser = this.auth.currentUser;
    if (!currentUser || !this.usernameToFollow.trim()) return;

    const usersRef = collection(this.firestore, 'users');
    const allUsersSnap = await getDocs(usersRef);
    const targetDoc = allUsersSnap.docs.find(
      doc => doc.data()['username'].toLowerCase() === this.usernameToFollow.trim().toLowerCase()
    );

    if (!targetDoc) {
      const alert = await this.alertCtrl.create({
        header: 'User Not Found',
        message: 'That username does not exist.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const targetUid = targetDoc.id;


    if (targetUid === currentUser.uid) {
      const alert = await this.alertCtrl.create({
        header: 'Oops!',
        message: 'You cannot follow yourself.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }


    const followsRef = collection(this.firestore, 'follows');
    const q = query(
      followsRef,
      where('followerId', '==', currentUser.uid),
      where('followingId', '==', targetUid)
    );
    const alreadyFollowed = await getDocs(q);
    if (!alreadyFollowed.empty) {
      const alert = await this.alertCtrl.create({
        header: 'Already Following',
        message: 'You already follow this user.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }


    await addDoc(followsRef, {
      followerId: currentUser.uid,
      followingId: targetUid,
    });

    this.usernameToFollow = '';
    await this.loadFollowedUsers();
  }

  async unfollow(user: any) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    const confirm = await this.alertCtrl.create({
      header: 'Unfollow User?',
      message: `Are you sure you want to unfollow @${user.username}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Unfollow',
          role: 'destructive',
          handler: async () => {
            const followsRef = collection(this.firestore, 'follows');
            const q = query(
              followsRef,
              where('followerId', '==', currentUser.uid),
              where('followingId', '==', user.uid)
            );

            const snap = await getDocs(q);
            if (!snap.empty) {
              const docId = snap.docs[0].id;
              await deleteDoc(doc(this.firestore, 'follows', docId));
              await this.loadFollowedUsers();
            }
          },
        },
      ],
    });

    await confirm.present();
  }

  goToUserDetail(user: any) {
    this.router.navigate(['/user', user.uid]);
  }
}
