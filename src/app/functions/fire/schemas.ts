import { Injectable } from '@angular/core'

const FireDangerLevel:{[k:number]:string} = {
  1:'甲',
  2:'乙' , 
  3: '丙', 
  4: '丁',
  5: '戊'
}

export declare class FireCheck{
  id:number;
  status: string;
  projectCode: number;
  apply: Date;
  reg: Date;
  file: string;
  contracts: string;
  tel: string;
  corp: number;
  source: string;
  danger: number;
  
}

@Injectable({providedIn: 'root'})
export class DataDefine {

  fireDanerLevels = Object.keys(FireDangerLevel).map(key => ({key:Number(key),label: FireDangerLevel[key]}));

}