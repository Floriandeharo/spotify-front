import { Injectable } from '@angular/core';
import { ToastInfo } from './model/toast-info.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts : ToastInfo[] = [];

  show(body: string, type: "SUCCES" | "DANGER" ){
    let className;
    if(type === "SUCCES"){
      className = "bg-success text-light";
    }else{
      className = "bg-danger text-light";
    }
    const toastInfo: ToastInfo ={body, className};
    this.toasts.push(toastInfo);
  }
  constructor() { }


  remove(toasts: ToastInfo){
    this.toasts = this.toasts.filter((toastToCompare: ToastInfo) => toastToCompare != toasts);
  }
}
