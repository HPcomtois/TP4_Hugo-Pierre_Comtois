import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {Photo, Voyage} from "../voyages/voyages.component";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Route, Router} from "@angular/router";

@Component({
  selector: 'app-voyage-photo',
  templateUrl: './voyage-photo.component.html',
  styleUrls: ['./voyage-photo.component.css']
})
export class VoyagePhotoComponent implements OnInit{

  constructor(public http: HttpClient, public router: Router, public route: ActivatedRoute){ }

  @ViewChild("_fileUploadViewChild", {static:false}) fileUpload ?: ElementRef;
  voyage: Voyage = new Voyage(0, "", "", false);
  photos: Photo[] = [];

  async getVoyagePhotos(inputId : number): Promise<void> {
    if(inputId == 0){
      console.log("id est null")
      this.router.navigate(['voyages/']);
    }

    let res = await  lastValueFrom(this.http.get<Voyage>(
      'http://localhost:5042/api/Voyages/' + inputId));
    let photosRes = await lastValueFrom(this.http.get<Photo[]>(
      'http://localhost:5042/api/Photos/' + inputId));

    console.log(res);
    console.log(photosRes);

    this.voyage = res;
    this.photos = photosRes;
  }

  async uploadPhoto(id:number){
    if(this.fileUpload == undefined){
      console.log("Input non chargé.");
      return;
    }
    let file = this.fileUpload.nativeElement.files[0];
    if(file == null){
      console.log("Input ne contient pas d'image.");
      return;
    }

    let formData= new FormData();
    formData.append('image', file, file.name);

    let res = await lastValueFrom(this.http.post<any>('http://localhost:5042/api/Photos/Upload/'+ id,formData));
    console.log(res);
    location.reload();
  }

  async deletePhoto(id: number): Promise<void>{
    if(id == 0){
      console.log("id est null")
      return;
    }
    let res = await lastValueFrom(this.http.delete<any>('http://localhost:5042/api/Photos/' + id))
    console.log(res);
    this.getVoyagePhotos(this.voyage.id);
  }


  ngOnInit(): void {
    this.voyage.id = parseInt(<string>this.route.snapshot.paramMap.get('id'));
    this.getVoyagePhotos(this.voyage.id);
  }
}
