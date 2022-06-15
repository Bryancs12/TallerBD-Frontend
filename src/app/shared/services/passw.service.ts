import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PasswService {

  constructor(private http : HttpClient) { }

  public resetPassw(datos : any) : Observable<any>{
    return this.http.patch<any>(`${environment.SRV}/usuario/passw/reset`, datos)

  }
}
