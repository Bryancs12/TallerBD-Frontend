import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, retry, throwError, catchError, of} from "rxjs";
import {Cliente} from "../models/cliente.model";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  SRV : string = environment.SRV;

  constructor(
    private http :HttpClient
  ) { }
  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type' : 'Application/json'
    })
  }


  filter(parametros: any, pag: number, lim :number) : Observable<Cliente>{
    let params = new HttpParams;
    for (const prop in parametros){
      if(prop){
        params = params.append(prop, parametros[prop])
      }
    }
    return this.http.get<Cliente>(`${this.SRV}/filtro/cliente/${pag}/${lim}`, {params:params})
      .pipe(retry(1),catchError(this.handleError));
  }
  search(id: any) : Observable <Cliente>{
    return this.http.get<Cliente>(`${this.SRV}/cliente/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  save(datos : Cliente, id? : number) : Observable<any> {
    if (id) {
      //modificar
      return this.http.put<Cliente>(`${this.SRV}/cliente/${id}`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear nuevo
      return this.http.post<Cliente>(`${this.SRV}/cliente/`, datos, this.httpOptions)
        .pipe( catchError(error => {
            return of(error.status)
          })
        )
    }
  }

  delete(id : any) : Observable<any>{
    return this.http.delete<Cliente>(`${this.SRV}/cliente/${id}`)
      .pipe( catchError(error =>{
        return of(error.status)
      }));
        //catchError(this.handleError)
  }

  private handleError(error:any){
    return  throwError(
      ()=>{
        return error.status
      })
  }
}
