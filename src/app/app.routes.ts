import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage) 
  },
  { 
    path: 'event-list',
    loadComponent: () => import('./pages/event-list/event-list.page').then(m => m.EventListPage) 
  },
  {
    path: 'event-create',
    loadComponent: () => import('./pages/event-create/event-create.page').then(m => m.EventCreatePage)
  },
  {
    path: 'following',
    loadComponent: () => import('./pages/following/following.page').then(m => m.FollowingPage)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./pages/user-detail/user-detail.page').then(m => m.UserDetailPage)
  },
  {
    path: 'edit-event/:id',
    loadComponent: () => import('./pages/edit-event/edit-event.component').then(m => m.EditEventPage)
  }
  
];
