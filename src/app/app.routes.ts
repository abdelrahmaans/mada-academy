import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./public/pages/home/home.page').then((m) => m.HomePage)
      },
      {
        path: 'tracks',
        loadComponent: () => import('./public/pages/tracks/tracks.page').then((m) => m.TracksPage)
      },
      {
        path: 'content',
        loadComponent: () => import('./public/pages/content/content.page').then((m) => m.ContentPage)
      },
      {
        path: 'gallery',
        loadComponent: () => import('./public/pages/gallery/gallery.page').then((m) => m.GalleryPage)
      },
      {
        path: 'contact',
        loadComponent: () => import('./public/pages/contact/contact.page').then((m) => m.ContactPage)
      }
    ]
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'admin',
    canMatch: [authGuard, adminGuard],
    loadComponent: () =>
      import('./layout/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
      },
      {
        path: 'leads',
        loadComponent: () => import('./admin/pages/leads/leads.page').then((m) => m.LeadsPage)
      },
      {
        path: 'homepage-editor',
        loadComponent: () =>
          import('./admin/pages/homepage-editor/homepage-editor.page').then((m) => m.HomepageEditorPage)
      },
      {
        path: 'tracks-manager',
        loadComponent: () =>
          import('./admin/pages/tracks-manager/tracks-manager.page').then((m) => m.TracksManagerPage)
      },
      {
        path: 'stars-board-manager',
        loadComponent: () =>
          import('./admin/pages/stars-board-manager/stars-board-manager.page').then(
            (m) => m.StarsBoardManagerPage
          )
      },
      {
        path: 'content-manager',
        loadComponent: () =>
          import('./admin/pages/content-manager/content-manager.page').then((m) => m.ContentManagerPage)
      },
      {
        path: 'gallery-manager',
        loadComponent: () =>
          import('./admin/pages/gallery-manager/gallery-manager.page').then((m) => m.GalleryManagerPage)
      },
      {
        path: 'testimonials-manager',
        loadComponent: () =>
          import('./admin/pages/testimonials-manager/testimonials-manager.page').then(
            (m) => m.TestimonialsManagerPage
          )
      },
      {
        path: 'faq-manager',
        loadComponent: () => import('./admin/pages/faq-manager/faq-manager.page').then((m) => m.FaqManagerPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./admin/pages/settings/settings.page').then((m) => m.SettingsPage)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
