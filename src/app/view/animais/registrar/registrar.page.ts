import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Animais } from 'src/app/model/entities/Animais';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  puxaForm: boolean = false;

  public imagem! : any;
  public user! : any;
  event: FormGroup = new FormGroup({});

  constructor(private alert: AlertService, private router: Router, private firebase: FirebaseService, private auth : AuthService, private formBuilder : FormBuilder) {
    this.puxaForm = true;
    this.puxaForm = false;
    this.user = this.auth.getUserLogged();
  }


  ngOnInit() {}
  
  registrar(event : any){
    this.firebase.uploadImage(
      this.imagem,
      new Animais(
        event.especie,
        event.nome,
        event.genero,
        event.peso,
        event.saude,
      )
    );
  }

  uploadFile(event : any) {
    this.imagem = event.target.files
  }

}