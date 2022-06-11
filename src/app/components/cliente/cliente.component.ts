import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente.model";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  titulo: string = '';
  clientes = [new Cliente()];
  filtro : any;
  frmCliente : FormGroup;

  constructor(private srvCliente: ClienteService, private fb : FormBuilder, private srvAuth : AuthService) {
    this.frmCliente = this.fb.group({
      id : [''],
      idCliente : ['', [Validators.required, Validators.maxLength(15)]],
      nombre : ['',
        [Validators.required, Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')
        ]
      ],
      apellido1 : ['',
        [
          Validators.required, Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')
        ]
      ],
      apellido2 : ['',
        [
          Validators.required, Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')
        ]
      ],
      telefono : ['',
        [
          Validators.pattern('[0-9]{4}-[0-9]{4}')
        ]
      ],
      celular : ['',
        [
          Validators.required,
          Validators.pattern('[0-9]{4}-[0-9]{4}')
        ]
      ],
      correo : ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      direccion : ['',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],
    })
  }

  get E() {
    return this.frmCliente.controls;
  }

  onNew() {
    this.titulo = 'Nuevo cliente';
    this.frmCliente.reset();
  }

  onSave2(){
    console.log(this.frmCliente)
  }

  onSave() {
    console.log(this.frmCliente.value);
    const data = new Cliente(this.frmCliente.value);
    let llamada : Observable<any>;
    let texto : string = '';

    if(data.id){
      const id = data.id;
      delete data.id;
      delete data.fechaIngreso;
      llamada = this.srvCliente.save(data,id);
      texto = 'Cambios realizados!'
    }else{
      delete data.id;
      llamada = this.srvCliente.save(data);
      texto = 'Creado de forma exitosa!';
    }

    llamada.subscribe({
      complete : () =>{
        this.filter();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: texto,
          showConfirmButton: false,
          timer: 3000
        })
      },
      error : (e) =>{

        switch (e) {
          case 404:

            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'id cliente no encontrado',
              showConfirmButton: false,
              showCancelButton: true,
              cancelButtonColor : '#d33',
              cancelButtonText : 'Cerrar'
            })

            break;

          case 409:

            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'id cliente ya existe',
              showConfirmButton: false,
              showCancelButton: true,
              cancelButtonColor : '#d33',
              cancelButtonText : 'Cerrar'
            })

            break;
        }
      }
    })



  }

  onEdit(id: any) {
    this.titulo = 'Editar cliente';
    this.srvCliente.search(id).subscribe({
      next : (data) =>{
        console.log(data);
        delete data.fechaIngreso;
        this.frmCliente.setValue(data);
      }
    })
  }

  onDelete(id: any, nombre: string) {
    Swal.fire({
      title: `Eliminar cliente ${id}?`,
      text: nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvCliente.delete(id).subscribe({

          complete : () =>{
            this.filter();
            Swal.fire(
              'Eliminado!',
              'Tu archivo ha sido eliminado.',
              'success'
            )
          },
          error : (err) =>{
            switch (err) {
              case 404:
                Swal.fire({
                  position: 'center',
                  icon: 'info',
                  title: 'id cliente no encontrado',
                  showConfirmButton: false,
                  showCancelButton: true,
                  cancelButtonColor : '#d33',
                  cancelButtonText : 'Cerrar'
                })
                break;

              case 412:

                Swal.fire({
                  position: 'center',
                  icon: 'info',
                  title: 'No se puede eliminar',
                  text: 'El cliente tiene un artefacto relacinonado',
                  showConfirmButton: false,
                  showCancelButton: true,
                  cancelButtonColor : '#d33',
                  cancelButtonText : 'Cerrar'
                })

                break;
            }
          }

        })
      }
    })
  }

  onFilter() {
    alert('filter test');
  }

  onPrint() {
    alert('print test');
  }

  onClose() {
    alert('close test');
  }

  private filter(): void {
    this.srvCliente.filter(
      this.filtro, 1, 10).subscribe(
      data => {
        this.clientes = Object(data);
        console.log(data)
      }
    )
  }


  ngOnInit(): void {
    this.filtro = {
      idCliente : '',
      nombre : '',
      apellido1 : '',
      apellido2 : ''
    };
    this.filter();
    console.log(this.srvAuth.valueUrsActual)
  }
}

