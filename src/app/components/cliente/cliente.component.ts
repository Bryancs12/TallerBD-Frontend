import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ClienteService} from "../../shared/services/cliente.service";
import {Cliente} from "../../shared/models/cliente.model";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  titulo : string = '';
  clientes = [new Cliente()];

  constructor(private  srvCliente : ClienteService) {
  }



  onNew(){
  this.titulo = 'Nuevo cliente';
  }

  onSave(){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Cliente guardado',
      showConfirmButton: false,
      timer: 3000
    })
  }

  onEdit(id : any){
  this.titulo = 'Editar cliente' + id;
  }

  onDelete(id : any, nombre: string){
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
        Swal.fire(
          'Eliminado!',
          'Tu archivo ha sido eliminado.',
          'success'
        )
      }
    })
  }

  onFilter(){
    alert('filter test');
  }

  onPrint(){
    alert('print test');
  }

  onClose(){
    alert('close test');
  }


  ngOnInit(): void {
    this.srvCliente.filter({
      idCliente : '',
      nombre: '',
      apellido1: '',
      apellido2: ''
    },1,10).subscribe(
      data =>{
        this.clientes = Object(data);
        console.log(data)
      }
    )
  }

}
