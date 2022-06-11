export class User {
  usr : string;
  rol : number;

  constructor(user? : User) {
    this.usr = user === undefined ? '' : user?.usr;
    this.rol = user === undefined ? -1 : user?.rol;
  }
}
