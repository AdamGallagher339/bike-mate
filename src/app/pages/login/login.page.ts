import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular'; // <-- Added ToastController
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';

  auth = inject(Auth);
  toastCtrl = inject(ToastController); 

  constructor(private router: Router) {}

  async login() {
    if (!this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter both email and password',
        duration: 2500,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);

      const toast = await this.toastCtrl.create({
        message: 'Login successful!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigateByUrl('/profile');
    } catch (err: any) {
      const toast = await this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
