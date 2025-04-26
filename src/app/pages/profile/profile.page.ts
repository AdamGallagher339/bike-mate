import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  createdBy?: string;
  createdAt?: any;
}

interface ExtendedEvent extends EventData {
  id: string;
  eventDate: Date;
  countdown?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  firestore = inject(Firestore);
  auth = inject(Auth);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  username = '';
  riderType = '';
  motorcycleBrand = '';
  motorcycleModel = '';
  nextEvent: ExtendedEvent | null = null;

  async ionViewWillEnter() {
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    const uid = user.uid;

    // Load user profile
    const userDoc = collection(this.firestore, 'users');
    const userSnapshot = await getDocs(userDoc);
    const userData = userSnapshot.docs.find(doc => doc.id === uid)?.data() as any;
    if (userData) {
      this.username = userData.username || '';
      this.riderType = userData.riderType || '';
      this.motorcycleBrand = userData.motorcycleBrand || '';
      this.motorcycleModel = userData.motorcycleModel || '';
    }

    // Load events & find nearest future one
    const eventsRef = collection(this.firestore, 'events');
    const snapshot = await getDocs(eventsRef);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureEvents: ExtendedEvent[] = snapshot.docs
      .map(docSnap => {
        const data = docSnap.data() as EventData;
        const [d, m, y] = data.date.split('/').map(Number);
        const eventDate = new Date(y + 2000, m - 1, d);
        return {
          id: docSnap.id,
          ...data,
          eventDate,
        };
      })
      .filter(event => event.eventDate >= today)
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    if (futureEvents.length > 0) {
      const next: ExtendedEvent = futureEvents[0];
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const diffTime = next.eventDate.getTime() - now.getTime();
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      next.countdown = days === 0 ? 'Today' : `in ${days} day${days > 1 ? 's' : ''}`;
      this.nextEvent = next;
    } else {
      this.nextEvent = null;
    }
  }

  get googleMapsUrl(): SafeResourceUrl {
    if (!this.nextEvent?.location) return '';
    const encoded = encodeURIComponent(this.nextEvent.location);
    const url = `https://www.google.com/maps?q=${encoded}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
