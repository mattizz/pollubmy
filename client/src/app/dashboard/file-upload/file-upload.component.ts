import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  
  displayBackdrop = 'none';
  openedModal: boolean = false;
  depSelected: boolean = true;
  selectedDep: string;
  selectedSpec: string;
  selectedSub: string;
  specSelected: boolean = true;
  progress: number = 0;
  file: File = null;
  fileName: string;
  displayModal = 'none';
  displayPanel = 'none';
  objectKeys = Object.keys;
  deps = ['Elektrotechniki i Informatyki','Zarządzania'];
  specs = [{name: 'Informatyka', dep: 'Elektrotechniki i Informatyki'},
          {name: 'Zarządzanie', dep: 'Zarządzania'}];

  constructor(private http: HttpClient) { }

  ngOnInit() {}
  
  openContent(){
    if(!this.openedModal){
      this.displayPanel = 'block'
      this.openedModal = true;
    } else {
      this.displayPanel = 'none';
      this.openedModal = false;
    }
  }

  openModal(){
    this.displayModal = 'block';
    this.displayBackdrop = 'block';

  }
  onCloseHandled(){
    this.displayModal = 'none';
    this.displayBackdrop = 'none';
  }
  filterSpecByDep(){
    return this.specs.filter(x=>x.dep == this.selectedDep);
  }
  onSelectDep(event){
    let value = event.target.options;
    if(event){
      this.depSelected = false;
      this.selectedDep = value[value.selectedIndex].innerHTML;
    }
  }
  onSelectSpec(event){
    let value = event.target.options;
    if(event){
      this.specSelected = false;
      this.selectedSpec = value[value.selectedIndex].innerHTML;
    }
  }

  onFileSelected(event){
    this.file = <File>event.target.files[0];
    this.fileName = this.file.name;
  }
  onUpload(upload: NgForm){
    const data = new FormData;
    const form = upload.value;  
    console.log(form);
    data.append('file',this.file, this.file.name)
    this.http.post('/url',data,{
      reportProgress: true,
      observe: 'events'
    })
    .subscribe(event=>{
      if(event.type === HttpEventType.UploadProgress){
        this.progress = Math.round(event.loaded/event.total * 100);
        console.log(this.progress);
        console.log(event);
      } else if (event.type === HttpEventType.Response){
        console.log(event);
      }
    },err=>{
      console.log(err);
    })
  }
}
