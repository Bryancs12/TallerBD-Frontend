import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente.model";
import {FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {TokenService} from "../../shared/services/token.service";
import {Router} from "@angular/router";
import {trigger, state, style, transition, animate} from "@angular/animations";
import {ImpresionService} from "../../shared/services/impresion.service";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  animations: [trigger('estadoFiltro',
    [
      state('show',
       style({
        'max-height' : '100%',
        'opacity' : '1',
        'visibility' : 'visible'
      })),
      state('hide',
        style({
          'max-height' : '0',
          'opacity' : '0',
          'visibility' : 'hidden'
        })),
      transition('show => hide', animate('600ms ease-in-out')),
      transition('hide => show', animate('1000ms ease-in-out'))
    ]
  )]
})
export class ClienteComponent implements OnInit {

  titulo: string = '';
  clientes = [new Cliente()];
  filtro : any;
  frmCliente : FormGroup;
  pagActual = 1;
  itemsPPag = 2;
  numRegs = 0;
  paginas = [2,5,10,20,50];
  filtroVisible : boolean = false;
  clave : string = 'idCliente';
  reversa : boolean = false;

  constructor(
    private srvCliente: ClienteService,
    private fb : FormBuilder,
    private srvAuth : AuthService,
    private srvToken : TokenService,
    private router : Router,
    private srvImpresion : ImpresionService
  ) {
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

  onChangePag(e : any){
    this.pagActual = e;
    this.filter();
  }

  onChangeTama(e : any){
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filter();
  }

  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide'
  }

  onFilterChange(f: any){
    this.filtro = f;
    this.filter();

  }

  onOrder(clave : string){
    if(this.clave === clave){
      this.reversa = !this.reversa
    }
    this.clave = clave;
  }

  resetFilter(){
    this.filtro = {
      idCliente : '',
      nombre : '',
      apellido1 : '',
      apellido2 : ''
    };
    this.filter();
  }

  get E() {
    return this.frmCliente.controls;
  }

  onNew() {
    this.titulo = 'Nuevo cliente';
    this.frmCliente.reset();
  }

  onSave(){
    const datos = new Cliente(this.frmCliente.value);
    let llamada : Observable<any>;
    let texto : string = '';
    if(datos.id){
      const id = datos.id;
      delete datos.id;
      delete datos.fechaIngreso;
      llamada = this.srvCliente.save(datos, id);
      texto = 'Cambios Guardados de forma correcta!';
    }else{
      delete datos.id;
      llamada = this.srvCliente.save(datos);
      texto = 'Creado de forma correcta!';
    }

    llamada.subscribe({
        complete : () => {
          console.log('entre a complete')
          this.filter();
          Swal.fire({
            icon: 'success',
            title: texto,
            showConfirmButton: false,
            timer: 2000
          })
        },
        error: (e) => {
          switch(e){
            case 404:
              Swal.fire({
                title: "Id Cliente no encontrado",
                icon: 'error',
                showCancelButton : true,
                showConfirmButton : false,
                cancelButtonColor : '#d33',
                cancelButtonText : 'Cerrar'
              });
              break;
            case 409:
              Swal.fire({
                title: "Id Cliente ya existe",
                icon: 'error',
                showCancelButton : true,
                showConfirmButton : false,
                cancelButtonColor : '#d33',
                cancelButtonText : 'Cerrar'
              });
              break;
          }
        }
      })
}

  onEdit(id: any) {
    this.titulo = 'Modificar Cliente';
    this.srvCliente.search(id)
      .subscribe({
        next: (data) => {
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
              'Eliminado',
              '',
              'success'
            )
          },
          error: (error) => {
            switch (error) {
              case 404:
                Swal.fire({
                  title: "id Cliente no Encontrado",
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                })
                break;
              case 412:
                Swal.fire({
                  title: "No se puede eliminar",
                  text: 'El cliente tiene artefacto relacionado',
                  icon: 'info',
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: '#d33',
                  cancelButtonText: 'Cerrar'
                })
                break;
            }
          }

        })
      }
    })
  }

  onFilter() {
    this.filtroVisible = !this.filtroVisible;
    if(!this.filtroVisible){
      this.resetFilter();
    }
  }

  onPrint() {
    const encabezado = ["Id", "Nombre","Celular", "Correo"]
    /*const cuerpo = [
      ["1111","Bryan","135","bryan@gmail.com"],
      ["1111","Bryan","135","bryan@gmail.com"]
    ];*/
    this.srvCliente.filter(this.filtro, 1, this.numRegs)
      .subscribe(
        data => {
          const cuerpo = Object(data)['datos'].map(
            (obj : any) => {
              const datos = [
                obj.idCliente,
                obj.nombre + ' ' + obj.apellido1 + ' ' + obj.apellido2,
                obj.celular,
                obj.correo
              ]
              return datos
            }
          )
          this.srvImpresion.imprimir(encabezado,cuerpo, "Listado de clientes", true)
        }
      )

  }

  onClose() {
    this.router.navigate(['/home']);
  }

  private filter(): void{
    this.srvCliente.filter(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe(
        data => {
          //console.log(Object(data)['datos']);
          this.clientes = Object(data)['datos'];
          this.numRegs = Object(data)['cant'];

        }
      )
  }


  ngOnInit(): void {
    this.resetFilter();
    // console.log(this.srvAuth.valueUrsActual)
    // console.log(this.srvToken.timeExpToken())
  }
}

