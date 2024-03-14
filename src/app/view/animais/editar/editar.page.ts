import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Animais } from 'src/app/model/entities/Animais';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
  animal! : Animais;
  edicao : boolean = true;
  public imagem! : any;
  user : any;

  constructor(private firebase: FirebaseService, private router: Router, private alert: AlertService, private auth : AuthService, private FormBuilder:FormBuilder) {
    this.user = this.auth.getUserLogged();
   }

  ngOnInit() {
    this.animal = history.state.animal;
  }
  PermitirEdicao(){
    if(this.edicao){
      this.edicao=false;
    }else{
      this.edicao=true;
    }
  }

  uploadFile(event : any) {
    this.imagem = event.target.files
  }


  editar(event: any){
    let updated: Animais = new Animais(
      event.especie,
      event.nome,
      event.genero,
      event.saude,
      event.peso,
    );
    this.animal = history.state.animal;
    updated.id = this.animal.id;
    if (this.imagem) {
      this.firebase.uploadImage(this.imagem, updated);
    } else {
      updated.downloadURL = this.imagem.downloadURL;
      this.firebase.uploadImage(null, updated);
    }
  }

  excluir(event: any){
    this.firebase.delete(event.id);
  }

}