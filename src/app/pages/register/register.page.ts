import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email = '';
  password = '';

  auth = inject(Auth);
  firestore = inject(Firestore);
  constructor(private router: Router) {}

  async register() {
    if (!this.email || !this.password) {
      return alert('Please enter both email and password');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = userCredential.user.uid;

      const userDoc = doc(this.firestore, `users/${uid}`);
      await setDoc(userDoc, {
        email: this.email,
        createdAt: new Date()
      });

      this.router.navigateByUrl(`/settings`);
    } catch (err: any) {
      alert(err.message);
    }
  }
}
