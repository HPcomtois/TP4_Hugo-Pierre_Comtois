import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {User} from "../voyages/voyages.component";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})

export class InscriptionComponent {

  users: User[] = [];
  constructor(public http: HttpClient) { }

  register(inscription: NgForm){
    let user = {
      userName: inscription.value.nom_user,
      email: inscription.value.email_user,
      password: inscription.value.mdp_user,
      passwordConfirm: inscription.value.mdpConfirm_user
    }
    this.http.post<any>('http://localhost:5042/api/Account/Register', user).subscribe(res =>
        console.log(res)
    );
    this.users.push(user);
    inscription.resetForm();
  }
}
