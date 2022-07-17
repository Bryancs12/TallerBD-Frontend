import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, retry, throwError, catchError, of} from "rxjs";
import {Oficinista} from "../models/oficinista.model";
import {environment} from "../../../environments/environment";



@Injectable({
  providedIn: 'root'
})
export class OficinistaService {
  SRV : string = environment.SRV;

  constructor(
    private http :HttpClient
  ) { }
  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type' : 'Application/json'
    })
  }


  filter(parametros: any, pag: number, lim :number) : Observable<Oficinista>{
    let params = new HttpParams;
    for (const prop in parametros){
      if(prop){
        params = params.append(prop, parametros[prop])
      }
    }
    return this.http.get<Oficinista>(`${this.SRV}/oficinista/filtro/${pag}/${lim}`, {params:params})
      .pipe(retry(1),catchError(this.handleError));
  }
  search(id: any) : Observable <Oficinista>{
    return this.http.get<Oficinista>(`${this.SRV}/oficinista/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  save(datos : Oficinista, id? : number) : Observable<any> {
    if (id) {
      //modificar
      return this.http.put<Oficinista>(`${this.SRV}/oficinista/${id}`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear nuevo
      return this.http.post<Oficinista>(`${this.SRV}/oficinista/`, datos, this.httpOptions)
        .pipe( catchError(error => {
            return of(error.status)
          })
        )
    }
  }

  delete(id : any) : Observable<any>{
    return this.http.delete<Oficinista>(`${this.SRV}/oficinista/${id}`)
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

