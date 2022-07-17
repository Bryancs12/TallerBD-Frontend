import { Injectable } from '@angular/core';
import {Admin} from "../models/admin.model";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, Observable, of, retry, throwError} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  SRV : string = environment.SRV;
  constructor(
    private http :HttpClient
  ) { }

  httpOptions ={
    headers: new HttpHeaders({
      'Content-Type' : 'Application/json'
    })
  }


  filter(parametros: any, pag: number, lim :number) : Observable<Admin>{
    let params = new HttpParams;
    for (const prop in parametros){
      if(prop){
        params = params.append(prop, parametros[prop])
      }
    }
    return this.http.get<Admin>(`${this.SRV}/filtro/admin/${pag}/${lim}`, {params:params})
      .pipe(retry(1),catchError(this.handleError));
  }
  search(id: any) : Observable <Admin>{
    return this.http.get<Admin>(`${this.SRV}/admin/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  save(datos : Admin, id? : number) : Observable<any> {
    if (id) {
      //modificar
      return this.http.put<Admin>(`${this.SRV}/admin/${id}`, datos, this.httpOptions)
        .pipe(retry(1), catchError(this.handleError));
    } else {
      //crear nuevo
      return this.http.post<Admin>(`${this.SRV}/admin/`, datos, this.httpOptions)
        .pipe( catchError(error => {
            return of(error.status)
          })
        )
    }
  }

  delete(id : any) : Observable<any>{
    return this.http.delete<Admin>(`${this.SRV}/admin/${id}`)
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

