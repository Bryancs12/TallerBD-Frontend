import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {PasswService} from "../../shared/services/passw.service";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-change-passw',
  templateUrl: './change-passw.component.html',
  styleUrls: ['./change-passw.component.css']
})
export class ChangePasswComponent implements OnInit {

  frmPassw : FormGroup;
  saved : boolean = false;

  constructor(private fb : FormBuilder,
              private passwS : PasswService,
              private authSrv : AuthService,
              private router : Router
  ) {
    this.frmPassw = this.fb.group({
      passw : ['', Validators.required],
      passwN : ['', Validators.required],
      passwR : ['', Validators.required]
    },
      {validators : [this.checkPassw]})
  }

  checkPassw : ValidatorFn = (control : AbstractControl) : ValidationErrors | null =>{
    const passwN = control.get("passwN");
    const passwR = control.get("passwR");
    return passwN && passwR && passwN.value !== passwR.value ? {coincide : true} : null
  }

  onSubmit(){
    this.passwS.changePassw({
      idUsuario: this.authSrv.valueUrsActual.usr,
      passw: this.c.value.passw,
      passNew: this.c.value.passwN
    }).subscribe({
        complete :() =>{
          console.log('entre al complete')
          this.saved = true;
          setTimeout(()=>{
            this.saved = false;
            this.onClose();
          }, 3000)
        },
        error : (e) =>{
          if(e.status === 401){
            this.c.controls["passw"].setErrors({invalid:true})
          }
        }
      })
  }

  get c (){
    return this.frmPassw
  }

  onClose(){
    this.router.navigate(['/'])
  }

  ngOnInit(): void {
  }

}
