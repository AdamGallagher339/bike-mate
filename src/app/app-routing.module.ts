import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'event-list',
    loadChildren: () => import('./pages/event-list/event-list.module').then( m => m.EventListPageModule)
  },
  {
    path: 'event-create',
    loadChildren: () => import('./pages/event-create/event-create.module').then( m => m.EventCreatePageModule)
  },
  {
    path: 'following',
    loadChildren: () => import('./pages/following/following.module').then( m => m.FollowingPageModule)
  },
  {
    path: 'user-detail',
    loadChildren: () => import('./pages/user-detail/user-detail.module').then( m => m.UserDetailPageModule)
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./pages/user-detail/user-detail.page').then(m => m.UserDetailPage)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
