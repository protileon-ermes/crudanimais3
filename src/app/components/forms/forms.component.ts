import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NOMEM } from 'dns';
import { AlertService } from 'src/app/common/alert.service';
import { Animais } from 'src/app/model/entities/Animais';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent  implements OnInit {
  [x: string]: any;
  @Input() animal!: Animais;
  @Input() criar = new EventEmitter<Animais>();
  @Input() atualizar = new EventEmitter<Animais>();
  @Input() deletar = new EventEmitter<Animais>();
  @Input() imagemadd = new EventEmitter<any>();
  formRegistrar: FormGroup = new FormGroup({});
  public user : any;
  public imagem: any = null;  
  editar: boolean = true;

  constructor(private router: Router,private auth: AuthService,private builder: FormBuilder, private firebase: FirebaseService, private alert : AlertService) {
    this.user = this.auth.getUserLogged();
    this.formRegistrar = this.builder.group({
      especie: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      nome: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      genero: ['',[Validators.required]],
      peso: ['',[Validators.required, Validators.min(1)]],
      saude: ['',[Validators.required]]
    });
  }

  
  ngOnInit() {
    if (!this.animal){
      this.editar=false;
    } 
    this.formRegistrar = this.builder.group({
      especie: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      nome: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      genero: ['',[Validators.required]],
      peso: ['',[Validators.required, Validators.min(1)]],
      saude: ['',[Validators.required]]
    });

    if(this.animal){
      this.formRegistrar.patchValue({
        especie: this.animal.especie,
        nome: this.animal.nome,
        genero: this.animal.genero,
        peso: this.animal.peso,
        saude: this.animal.saude
      })
    }
  }

  submitForm(){
    if(!this.formRegistrar.valid){
      console.error('Formulário inválido');
      return false;
    }

    if (!this.animal) {
      this.criarAnimal();
    } else {
      this.atualizarAnimal();
    }
    return true;
  }

  criarAnimal(){
    const animalData = this.formRegistrar.value;
    const userId = this.auth.getUserId();
    animalData.uid=userId;
    this.firebase.create(animalData).then(() => {
      console.log('Animal criado com sucesso!');
      
      this.alert.presentAlert('Sucesso', 'Animal criado').then(() => {
        this.router.navigate(['/home']);
      });
    }).catch(error => {
      console.error('Erro ao criar animal:', error);
    });
  }

  atualizarAnimal(){
    const animalData = this.formRegistrar.value;
    const userId = this.auth.getUserId();
    animalData.uid=userId;
    this.firebase.update(animalData, this.animal.id).then(() => {
      this.alert.presentAlert('Boa', 'Animal editado').then(() => {
        this.router.navigate(['/home']);
      });
    }).catch(error => {
      console.error('Erro ao editar animal:', error);
    });
  }

  deletarAnimal(){
    this.firebase.delete(this.animal.id).then(() => {
      this.alert.presentAlert(':(', 'Animal deletado').then(() => {
        this.router.navigate(['/home']);
      });
    }).catch(error => {
      console.error('Erro ao deletar animal:', error);
    });
  }

  uploadImg(imagem: any){
    const animalData = this.formRegistrar.value;
    const userId = this.auth.getUserId();
    animalData.uid=userId;
    this.firebase.uploadImage(imagem, animalData);
    console.log("imagem")
  }

  PermitirEdicao(){
    if(this.editar){
      this.editar=false;
    }else{
      this.editar=true;
    }
  }
}
