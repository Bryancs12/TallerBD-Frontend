export class Oficinista {
  id? :number;
  idOficinista :string;
  nombre :string;
  apellido1 :string;
  apellido2 :string;
  celular :string;
  telefono :string;
  direccion :string;
  correo :string;
  fechaIngreso? :Date;
  constructor(c? : Oficinista){
    if(c?.id !== undefined){
      this.id = c?.id;
    }
    this.idOficinista = c != undefined ? c?.idOficinista : '';
    this.nombre= c != undefined ? c?.nombre : '';
    this.apellido1 = c != undefined ? c?.apellido1 : '';
    this.apellido2 = c != undefined ? c?.apellido2 : '';
    this.telefono = c != undefined ? c?.telefono : '';
    this.celular= c != undefined ? c?.celular : '';
    this.direccion= c != undefined ? c?.direccion : '';
    this.correo= c != undefined ? c?.correo : '';
    if(c?.fechaIngreso !== undefined){
      this.fechaIngreso = c.fechaIngreso;
    }
  }
}
