import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage {
  route = inject(ActivatedRoute);
  firestore = inject(Firestore);
  sanitizer = inject(DomSanitizer);
  storage = getStorage();

  user: any = null;
  events: any[] = [];
  nextEvent: any = null;
  defaultProfile = 'https://www.gravatar.com/avatar?d=mp&s=200';

  async ngOnInit() {
    const uid = this.route.snapshot.paramMap.get('id');
    if (!uid) return;

    const userSnap = await getDoc(doc(this.firestore, 'users', uid));
    if (userSnap.exists()) {
      this.user = userSnap.data();
      this.user.uid = uid;

      const eventsRef = collection(this.firestore, 'events');
      const q = query(eventsRef, where('createdBy', '==', uid));
      const snapshot = await getDocs(q);
      this.events = snapshot.docs.map(doc => doc.data());

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureEvents = this.events
        .map(event => {
          const [d, m, y] = event.date.split('/').map(Number);
          event.eventDate = new Date(y + 2000, m - 1, d);
          return event;
        })
        .filter(event => event.eventDate >= today)
        .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

      this.nextEvent = futureEvents[0] || null;
    }
  }

  get googleMapsUrl(): SafeResourceUrl {
    if (!this.nextEvent?.location) return '';
    const encoded = encodeURIComponent(this.nextEvent.location);
    const url = `https://www.google.com/maps?q=${encoded}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
