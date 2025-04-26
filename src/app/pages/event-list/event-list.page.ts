import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

interface EventData {
  title: string;
  date: string; // format: dd/mm/yy
  time: string;
  location: string;
  createdBy?: string;
  createdAt?: any;
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss']
})
export class EventListPage {
  firestore = inject(Firestore);
  auth = inject(Auth);
  router = inject(Router);

  events: Array<EventData & { id: string; daysLeft: number; isOwner: boolean }> = [];

  async ionViewWillEnter() {
    const user = this.auth.currentUser;
    const uid = user?.uid;

    const eventsRef = collection(this.firestore, 'events');
    const snapshot = await getDocs(eventsRef);

    this.events = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as EventData;
      return {
        id: docSnap.id,
        ...data,
        daysLeft: this.calculateDaysLeft(data.date),
        isOwner: data.createdBy === uid
      };
    });
  }

  calculateDaysLeft(dateString: string): number {
    const [day, month, year] = dateString.split('/').map(Number);
    const fullYear = year + 2000;
    const eventDate = new Date(fullYear, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = eventDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  async deleteEvent(eventId: string) {
    const confirmed = confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;

    try {
      await deleteDoc(doc(this.firestore, 'events', eventId));
      this.events = this.events.filter(e => e.id !== eventId);
      alert('Event deleted.');
    } catch (error) {
      console.error(error);
      alert('Failed to delete event.');
    }
  }

  editEvent(eventId: string) {
    this.router.navigateByUrl(`/edit-event/${eventId}`);
  }  
}
