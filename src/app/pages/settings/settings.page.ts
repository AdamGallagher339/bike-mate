import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage {
  firestore = inject(Firestore);
  auth = inject(Auth);
  toastCtrl = inject(ToastController);
  alertCtrl = inject(AlertController);
  storage = getStorage();
  router = inject(Router);

  userData: any = {};
  userProfileImage: string = ''; // Firebase saved Base64 string
  defaultProfile: string = 'https://www.gravatar.com/avatar?d=mp&s=200'; // Default placeholder
  previewURL: string = ''; // Temporary preview after selecting a file

  async ionViewWillEnter() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      this.userData = snap.data();

      // Pull the saved photo from Firestore
      if (this.userData.photoData) {
        this.userProfileImage = this.userData.photoData;
      } else {
        this.userProfileImage = '';
      }

      // Note: Do not override previewURL here, keep it for live previews only
    }
  }

  async onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    const user = this.auth.currentUser;
  
    if (!file || !user) return;
  
    // Maximum file size (in bytes)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  
    if (file.size > MAX_FILE_SIZE) {
      const toast = await this.toastCtrl.create({
        message: 'File too large. Please upload an image smaller than 2MB.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
  
      const userRef = doc(this.firestore, 'users', user.uid);
      await updateDoc(userRef, { photoData: base64 });
  
      this.previewURL = base64;
      this.userProfileImage = base64;
  
      const toast = await this.toastCtrl.create({
        message: 'Profile picture updated.',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    };
  
    reader.readAsDataURL(file);
  }


  async saveProfile() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, 'users', user.uid);

    await updateDoc(userRef, {
      username: this.userData.username,
      motorcycleBrand: this.userData.motorcycleBrand,
      motorcycleModel: this.userData.motorcycleModel,
      riderType: this.userData.riderType,
    });

    const toast = await this.toastCtrl.create({
      message: 'Profile info updated.',
      duration: 2000,
      color: 'success'
    });
    await toast.present();
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'This will permanently delete your account and all data.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const user = this.auth.currentUser;
            if (!user) {
              const toast = await this.toastCtrl.create({
                message: 'No user found.',
                duration: 2000,
                color: 'danger'
              });
              await toast.present();
              return;
            }
  
            try {
              const userRef = doc(this.firestore, 'users', user.uid);
              await deleteDoc(userRef);
  
              await user.delete();
  
              const toast = await this.toastCtrl.create({
                message: 'Account deleted successfully.',
                duration: 2000,
                color: 'success'
              });
              await toast.present();
  
              this.router.navigateByUrl('/');
  
            } catch (err: any) {
              console.error('Delete account error:', err);
  
              if (err.code === 'auth/requires-recent-login') {
                const toast = await this.toastCtrl.create({
                  message: 'Session expired. Please log in again to delete your account.',
                  duration: 3000,
                  color: 'warning'
                });
                await toast.present();
  
                await signOut(this.auth);
                this.router.navigateByUrl('/login');
              } else {
                const toast = await this.toastCtrl.create({
                  message: err.message || 'Failed to delete account.',
                  duration: 3000,
                  color: 'danger'
                });
                await toast.present();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }
  
}
