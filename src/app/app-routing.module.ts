import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ClienteComponent} from "./components/cliente/cliente.component";
import {ArtefactoComponent} from "./components/artefacto/artefacto.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {LoginGuard} from "./shared/guards/login.guard";

const routes: Routes = [

  {
    path : 'home', component : HomeComponent
  },
  {
    path : 'cliente', component: ClienteComponent, canActivate : [AuthGuard]
  },
  {
    path : 'artefacto', component: ArtefactoComponent
  },
  {
    path : 'login', component: LoginComponent, canActivate : [LoginGuard]
  },
  {
    path : '', pathMatch : 'full', redirectTo : 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
