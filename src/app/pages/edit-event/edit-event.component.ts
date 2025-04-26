import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterLink],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventPage {
  firestore = inject(Firestore);
  toastCtrl = inject(ToastController);
  route = inject(ActivatedRoute);
  router = inject(Router);

  eventId: string = '';
  title = '';
  date = '';
  time = '';
  location = '';

  async ionViewWillEnter() {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';

    if (this.eventId) {
      const eventRef = doc(this.firestore, 'events', this.eventId);
      const snap = await getDoc(eventRef);
      if (snap.exists()) {
        const eventData = snap.data();
        this.title = eventData['title'];
        this.date = eventData['date'];
        this.time = eventData['time'];
        this.location = eventData['location'];
      }
    }
  }

  async updateEvent() {
    if (!this.title || !this.date || !this.time || !this.location) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all fields.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const eventRef = doc(this.firestore, 'events', this.eventId);
    await updateDoc(eventRef, {
      title: this.title,
      date: this.date,
      time: this.time,
      location: this.location
    });

    const toast = await this.toastCtrl.create({
      message: 'Event updated successfully!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.router.navigateByUrl('/event-list');
  }
}
