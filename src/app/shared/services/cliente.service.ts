import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, retry, throwError, catchError} from "rxjs";
import {Cliente} from "../models/cliente.model";



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  SRV : string = 'http://tallerbd';

  constructor(private http : HttpClient) {

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type:' : 'Application/json'
    })

  }

  filter(parametros : any, pag: number, lim: number) : Observable<Cliente>{
    let params = new HttpParams;
    for (const prop in parametros){
      if(prop){
        params = params.append(prop, parametros[prop])
      }
    }
    return  this.http.get<Cliente>(`${this.SRV}/filtro/cliente/${pag}/${lim}`, {params:params})
      .pipe(retry(1), catchError(this.handleError));
  }
  private handleError(error:any){
    return throwError(()=>{
      return error.status
    })
  }
}
