import { Component, OnInit } from '@angular/core';
import { TecnicoService } from 'src/app/shared/services/tecnico.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import {Tecnico} from "../../shared/models/tecnico.model";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {ImpresionService} from "../../shared/services/impresion.service";

@Component({
  selector: 'app-tecnico',
  templateUrl: './tecnico.component.html',
  styleUrls: ['./tecnico.component.css'],
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
export class TecnicoComponent implements OnInit{
  titulo: string = '';
  tecnicos = [new Tecnico()];
  filtro : any;
  frmTecnico : FormGroup;
  pagActual = 1;
  itemsPPag = 2;
  numRegs = 0;
  paginas = [2,5,10,20,50];
  filtroVisible : boolean = false;
  clave : string = 'idTecnico';
  reversa : boolean = false;

  constructor(
    private srvTecnico: TecnicoService,
    private fb : FormBuilder,
    private srvAuth : AuthService,
    private router : Router,
    private srvImpresion : ImpresionService
  ) {
    this.frmTecnico = this.fb.group({
      id: [''],
      idTecnico: ['',[Validators.required, Validators.maxLength(15)]],
      nombre: ['',[Validators.required, Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern('([A-Za-zÑñáéíóú]*)( ([A-Za-zÑñáéíóú]*)){0,1}')]],
      apellido1: ['',[Validators.required, Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern('([A-Za-zÑñáéíóú]*)')]],
      apellido2: ['',[Validators.required, Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern('([A-Za-zÑñáéíóú]*)')]],
      telefono: ['',[Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      celular: ['',[Validators.required, Validators.pattern('[0-9]{4}-[0-9]{4}')]],
      correo: ['',[Validators.required, Validators.email]],
      direccion: ['',[Validators.required, Validators.minLength(5)]]
    });
  }

  onChangePag(e : any){
    this.pagActual = e;
    this.filtrar();
  }

  onChangeTama(e : any){
    this.itemsPPag = e.target.value;
    this.pagActual = 1;
    this.filtrar();
  }

  get stateFiltro(){
    return this.filtroVisible ? 'show' : 'hide'
  }

  onFilterChange(f: any){
    this.filtro = f;
    this.filtrar();

  }

  resetFilter(){
    this.filtro = {
      idTecnico : '',
      nombre : '',
      apellido1 : '',
      apellido2 : ''
    };
    this.filtrar();
  }

//Evento botones CRUD
  get E(){
    return this.frmTecnico.controls;
  }

  onNuevo() {
    this.titulo = 'Nuevo Tecnico'
    this.frmTecnico.reset();
  }
  onEditar(id: any) {
    this.titulo = 'Modificar Tecnico';
    this.srvTecnico.buscar(id)
      .subscribe({
        next: (data) => {
          console.log(data);
          delete data.fechaIngreso;
          this.frmTecnico.setValue(data);

        }
      })
  }
  onEliminar(id: any, nombre: string) {
    Swal.fire({
      title: `Eliminar Tecnico ${id}?`,
      text: nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.srvTecnico.eliminar(id)
          .subscribe({
            complete : () => {
              this.filtrar();
              Swal.fire(
                'Eliminado!',
                'El archivo a sido eliminado',
                'success'
              )
            },
            error: (error) => {
              switch(error){
                case 404:
                  Swal.fire({
                    title: "Eliminado",
                    text : 'El Tecnico ha sido eliminado',
                    icon: 'success',
                    showCancelButton : true,
                    showConfirmButton : false,
                    cancelButtonColor : '#d33',
                    cancelButtonText : 'Cerrar'
                  });
                  break;
                case 412:
                  Swal.fire({
                    title: "No se puede eliminar",
                    text: 'El tecnico tiene un caso relacionado',
                    icon: 'error',
                    showCancelButton : true,
                    showConfirmButton : false,
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

  onGuardar() {
    const datos = new Tecnico(this.frmTecnico.value);
    let llamada : Observable<any>;
    let texto : string = '';
    if(datos.id){
      const id = datos.id;
      delete datos.id;
      delete datos.fechaIngreso;
      llamada = this.srvTecnico.guardar(datos, id);
      texto = 'Cambios Guardados de forma correcta!';
    }else{
      delete datos.id;
      llamada = this.srvTecnico.guardar(datos);
      texto = 'Creado de forma correcta!';
    }

    llamada
      .subscribe({
        complete : () => {
          this.filtrar();
          Swal.fire({
            icon: 'success',
            title: texto,
            showConfirmButton: false,
            timer: 1500
          })
        },
        error: (e) => {
          switch(e){
            case 404:
              Swal.fire({
                title: "Id Tecnico no encontrado",
                icon: 'error',
                showCancelButton : true,
                showConfirmButton : false,
                cancelButtonColor : '#d33',
                cancelButtonText : 'Cerrar'
              });
              break;
            case 409:
              Swal.fire({
                title: "El Tecnico ya existe!",
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

  //Evento botones en general
  onFiltrar() {
    this.filtroVisible = !this.filtroVisible;
    if(!this.filtroVisible){
      this.resetFilter();
    }
  }
  onImprimir() {
    const encabezado = ["Id", "Nombre","Celular", "Correo"]
    /*const cuerpo = [
      ["1111","Bryan","135","bryan@gmail.com"],
      ["1111","Bryan","135","bryan@gmail.com"]
    ];*/
    this.srvTecnico.filtrar(this.filtro, 1, this.numRegs)
      .subscribe(
        data => {
          const cuerpo = Object(data)['datos'].map(
            (obj : any) => {
              const datos = [
                obj.idTecnico,
                obj.nombre + ' ' + obj.apellido1 + ' ' + obj.apellido2,
                obj.celular,
                obj.correo
              ]
              return datos
            }
          )
          this.srvImpresion.imprimir(encabezado,cuerpo, "Listado de Tecnicos", true)
        }
      )
  }
  onCerrar() {
    this.router.navigate(['/home']);
  }

  private filtrar(): void{
    this.srvTecnico.filtrar(this.filtro, this.pagActual, this.itemsPPag)
      .subscribe(
        data => {
          this.tecnicos = Object(data)['datos'];
          this.numRegs = Object(data)['cant'];

        }
      )
  }

  //
  ngOnInit() : void{
    this.resetFilter();
    console.log(this.srvAuth.valueUrsActual)
  }
}
