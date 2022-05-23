import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  constructor() { }

  onNew(){
    alert('New test');
  }

  onEdit(){
    alert('edit test');
  }

  onDelete(){
    alert('delete test');
  }

  onFilter(){
    alert('filter test');
  }


  ngOnInit(): void {
  }

}
