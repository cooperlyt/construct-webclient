import { Injectable, Pipe, PipeTransform, NgModule } from '@angular/core'

const FireDangerLevel:{[k:number]:string} = {
  1:'甲',
  2:'乙' , 
  3: '丙', 
  4: '丁',
  5: '戊'
}

const FireRatingLevel:{[k:number]:string} = {
  1:'一级',
  2:'二级' , 
  3: '三级', 
  4: '四级'
}


 enum CheckStatus{
  Prepare = "准备中",
  Running = "运行中",
  Qualified = "验收合格",
  Unqualified = "验收不合格",
  NoAccept = "不予受理",
  Abort = "中止"
}

 enum UseProperty{
  FULL= "人员密集场所",
  PUB= "公众聚集场所",
  DAN= "易燃易爆场所"
}

 enum TinType{
  OUTSIDE="浮顶罐 - 外",
  INSIDE = "浮顶罐 - 内",
  FIX  = "固定顶罐",
  HORIZONTAL = "卧式罐",
  WATER = "球形罐 - 液体",
  GAS = "球形罐 - 气体",
  DRY = "可燃气体储罐 - 干式",
  WET = "可燃气体储罐 - 湿式",
  OTHER = "其它"
}

 enum TinLayout{
  ON="地上",
  HALF="半地下",
  UNDER="地下"
}

enum FitPart{
  CELL="顶棚",
  WALL="墙面",
  FLOOR="地面",
  PARTITION="隔断",
  FIXED="固定家具",
  FABRIC="装饰织物",
  OTHER="其他"
}

enum ApplyType{
  First="验收申请",
  Review="复查申请"
}

export enum WarmType{
  A = "",
  A1 = "",
  B2 = ""
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
  ownerName:string;
  ownerIdType:string;
  ownerId:string;
}

export declare class FireCheckProject{
  name:string;
  address: string;
  type: string;
  property: string;
  landArea: number;
  importantType: string;
  
  modifyFit:boolean;
  modifyWarm:boolean;
  modifyUse:boolean;
 
  corps: FireCheckProjectCorp[];
}

export declare class StoreTinCheck{
  location: string;
  area: number;
  type: string;
  layout: string;
  name : string;
}

export declare class StoreSquareCheck{
  area: number;
  name: string;
}

export declare class ModifyFitCheck{
  part: string;
  area: number;
  layers: number;
}

export declare class ModifyWarmCheck{
  type: string;
  layers: number;
}

export declare class CheckBuildInfo{
  name: string;
  landArea: number;
  structure: string;
  onCount: number;
  underCount: number;
  height: number;
  onArea: number;
  underArea: number;
}

export declare class CheckBuild{
  rating: number;
  danger: number;
  code: number;
  info: CheckBuildInfo;

}

export declare class FireCheck{
  id:number;
  status: string;
  projectCode: number;
  applyTime: Date;
  regTime: Date;
  applyFile: string;
  fireFile: string;
  contracts: string;
  constructFile: string;
  tel: string;
  corp: number;
  corpProperty: string;
  source: string;
  inRandom: boolean;
  property:string;
  type: string;
  part: boolean;
  memo: string;
  conclusion: string;
  oldUse: string;
  project: FireCheckProject;
  tin?: StoreTinCheck;
  square?: StoreSquareCheck;
  fit?:ModifyFitCheck;
  warm?:ModifyWarmCheck;
  builds: CheckBuild[];
}


@Pipe({name: 'fireDangerLevel'})
export class ProjectFireDangerLevelPipe implements PipeTransform {
    transform(value: number) {
        return FireDangerLevel[value];
    }
}

@Pipe({name: 'fireRatingLevel'})
export class FireRatingLevelPipe implements PipeTransform{
  transform(value: number ) {
    return FireRatingLevel[value];
  }
}


@Pipe({name: 'fireCheckStatus'})
export class CheckStatusPipe implements PipeTransform{
  transform(value: string) {
    return CheckStatus[value];
  }

}

@Pipe({name: 'fireUseProperty'})
export class UsePropertyPipe implements PipeTransform{
  transform(value:string) {
    return UseProperty[value];
  }

}

@Pipe({name: 'fireTinType'})
export class TinTypePipe implements PipeTransform{
  transform(value: string) {
    return TinType[value];
  }

}
@Pipe({name: 'fireTinLayout'})
export class TinLayoutPipe implements PipeTransform{
  transform(value: string) {
    return TinLayout[value];
  }
}

@Pipe({name:"fireFitPart"})
export class FireFitPartPipe implements PipeTransform{
  transform(value: string) {
    return FitPart[value];
  }
}

@Pipe({name:'fileApplyType'})
export class ApplyTypePipe implements PipeTransform{
  transform(value:string) {
    return ApplyType[value];
  }
}



@Injectable({providedIn: 'root'})
export class DataDefine {

  danerLevels = Object.keys(FireDangerLevel).map(key => ({key:Number(key),label: FireDangerLevel[key]}));

  ratingLevels = Object.keys(FireRatingLevel).map(key => ({key:Number(key), label: FireRatingLevel[key]}));

  checkStatus = Object.keys(CheckStatus).map(key => ({key: key, label:CheckStatus[key] }));

  userProperty = Object.keys(UseProperty).map(key => ({key: key, label: UseProperty[key]}));

  tinType = Object.keys(TinType).map(key => ({key: key, label: TinType[key]}));

  tinLayout = Object.keys(TinLayout).map(key => ({key: key, label: TinLayout[key]}));

  fireFitPart = Object.keys(FitPart).map(key => ({key: key, label: FitPart[key]}));

  fireWarmType = Object.keys(WarmType);

}

@NgModule({declarations:
  [
    ProjectFireDangerLevelPipe,
    FireRatingLevelPipe,
    CheckStatusPipe,
    UsePropertyPipe,
    TinTypePipe,
    TinLayoutPipe,
    FireFitPartPipe,
    ApplyTypePipe

  ], exports:[
    ProjectFireDangerLevelPipe,
    FireRatingLevelPipe,
    CheckStatusPipe,
    UsePropertyPipe,
    TinTypePipe,
    TinLayoutPipe,
    FireFitPartPipe,
    ApplyTypePipe
  ]})
export class FireCheckSchemasModule{}