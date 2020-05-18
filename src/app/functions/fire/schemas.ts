import { Injectable, Pipe, PipeTransform, NgModule } from '@angular/core'

const FireDangerLevel:{[k:number]:string} = {
  1:'甲',
  2:'乙' , 
  3: '丙', 
  4: '丁',
  5: '戊'
}

export declare class FireCheckProjectCorp{
  level:number;
  name: string;
  groupIdType: string;
  groupId:string;
  contacts:string;
  tel:string;
  property:string;
  code:number;
}

export declare class FireCheckProject{
  name:string;
  address: string;
  type: string;
  modifyType: string;
  typeLevel:number;
  floorType:string;
  structure: string;
  property: string;
  height: number;
  importantType: string;
  area: number;
  landArea: number;
  groundCount: number;
  underCount: number;
  corps: FireCheckProjectCorp[];
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
  inRandom: boolean;
  project: FireCheckProject;
}


@Pipe({name: 'projectFireDangerLevel'})
export class PersonCardLabelPipe implements PipeTransform {
    transform(value: number) {
        return FireDangerLevel[value];
    }
}

@Injectable({providedIn: 'root'})
export class DataDefine {

  fireDanerLevels = Object.keys(FireDangerLevel).map(key => ({key:Number(key),label: FireDangerLevel[key]}));

}

@NgModule({declarations:[PersonCardLabelPipe], exports:[PersonCardLabelPipe]})
export class FireCheckSchemasModule{}