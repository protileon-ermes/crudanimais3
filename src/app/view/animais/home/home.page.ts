import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Animais } from 'src/app/model/entities/Animais';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  listaAnimal : any[]=[];
  animal : any[]=[];
  public user: any;
  isLoading: boolean = false;

  @ViewChild('searchbar') search!: IonSearchbar;
  hasSearched: boolean = false;
  query: any;
  model: any={
    icon: 'ban-outline',
    title:'nenhum animal cadastrado'
  }
  empty: any = {
    icon: 'search-outline',
    title:'nenhum animal cadastrado'
  }
  
  constructor(private firebase : FirebaseService,
    private authService : AuthService,
    private router : Router) {
      this.hasSearched = false;
      this.user = this.authService.getUserLogged()
      console.log(this.user);
      this.firebase.read(this.user.uid)
      .subscribe(res => {
        this.listaAnimal = res.map(animal =>{
          return{
            id: animal.payload.doc.id,
            ... animal.payload.doc.data() as any
          }as Animais;
        })
      })
    }
 
  irParaRegistro(){
    this.router.navigate(["/registrar"]);
  }
  irParaEditar(animal : Animais){
    this.router.navigateByUrl("/editar",{
      state: {animal: animal}});
  }

  logout(){
    this.authService.signOut().then((res)=>{
      this.router.navigate(["signin"]);
    })
  }

  async onSearchChange(event: any) {
    this.hasSearched = true;
    this.query = event.detail.value.toLowerCase();
    this.animal = [];
    if (this.query.length > 0) {
      this.isLoading = true;
      setTimeout(async () => {
        this.animal = await this.listaAnimal.filter((element: any) => {
          return element.nome.toLowerCase().includes(this.query);
        })
        console.log(this.animal);
        this.isLoading = false;
      }, 3000);
    }
}

  returnSearch() {
    this.hasSearched = false;
    this.search.value = null;
  }
}

