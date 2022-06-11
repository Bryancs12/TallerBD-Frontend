import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, retry, tap, of, BehaviorSubject} from "rxjs";
import  {map, catchError} from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {Token} from "../models/token";
import {TokenService} from "./token.service";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usrActualSubject = new BehaviorSubject<User>(new User());
  private usrActual = this.usrActualSubject.asObservable();

  constructor(private http : HttpClient, private srvToken : TokenService) { }

  public login(user : { usr: '', passw : '' }) : Observable<any>{
    return this.http.post<Token>(`${environment.SRV}/auth/login`, user)
      .pipe(
        retry(1),
        tap(tokens =>{
          console.log(tokens)
          this.doLogin(tokens)
        }),
        map(() => true),
        catchError(
          error => {return of (error.status)}
        )
      )
  }

  public get valueUrsActual () : User {
    return this.usrActualSubject.value
  }

  private doLogin(tokens : Token) : void{
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getActualUser());
  }

  public isLogged() : boolean{
    return !!this.srvToken.token;
  }

  public doLogout(){
    if (this.srvToken.token){
      this.srvToken.deleteTokens();
    }
    this.usrActualSubject.next(this.getActualUser())
  }

  private getActualUser() : User{
    if(!this.srvToken.token){
      return new User();
    }
    const tokenD = this.srvToken.decodeToken();
    return {usr: tokenD.sub, rol:tokenD.rol}
  }

}
