import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss'],
})
export class EventCreatePage {
  firestore = inject(Firestore);
  auth = inject(Auth);
  router = inject(Router);

  title = '';
  date = '';
  time = '';
  location = '';

  async createEvent() {
    if (!this.title || !this.date || !this.time || !this.location) {
      alert('Please fill in all fields.');
      return;
    }

    // ✅ Validate date format: dd/mm/yy
    const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(this.date)) {
      alert('Please enter the date in format dd/mm/yy (e.g. 20/04/25).');
      return;
    }

    // ✅ Check date is in the future
    const [day, month, year] = this.date.split('/').map(Number);
    const fullYear = year + 2000;
    const eventDate = new Date(fullYear, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate <= today) {
      alert('The event date must be in the future.');
      return;
    }

    // ✅ Validate time format: HH:mm
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(this.time)) {
      alert('Please enter the time in 24-hour format HH:mm (e.g. 14:30).');
      return;
    }

    const user = this.auth.currentUser;
    if (!user) {
      alert('You must be logged in to create an event.');
      return;
    }

    try {
      const eventsRef = collection(this.firestore, 'events');
      await addDoc(eventsRef, {
        title: this.title,
        date: this.date,
        time: this.time,
        location: this.location,
        createdBy: user.uid,
        createdAt: new Date()
      });

      alert('Event created!');
      this.router.navigateByUrl('/event-list');
    } catch (error) {
      console.error(error);
      alert('Failed to create event.');
    }
  }
}
