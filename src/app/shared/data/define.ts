import { Injectable, Pipe, PipeTransform } from '@angular/core';

export enum GroupIdType{
    COMPANY_CODE = "营业执照",
    CORP_CODE = "机构代码证",
    RELIGION = "宗教证"
}

export enum PersonIdType{
    MASTER_ID = "身份证",
    OFFICER_CARD = "军官证",
    SOLDIER_CARD = "士兵证",
    PASSPORT = "护照",
    TW_ID = "台湾通行证",
    GA_ID = "港澳通行证"
}

export enum JoinType{
    Developer = "开发单位",
    Design = "设计单位",
    Construct = "施工单位",
    Supervisor = "工程监理", 
    FireCheck = "消防质检",
    LandExploration = "土地勘查",
}

export enum BusinessSource{
    OLD = "补录",
    OLE = "申请",
    BIZ = "窗口"
}

export enum BusinessStatus{
    prepare = "准备中",
    running = "运行中",
    valid = "生效",
    invalid = "无效"
}

export enum OperateType{
    DELETE = "移除",
    MODIFY = "修改",
    CREATE = "创建",
    QUOTED = "引用"
}


const LEVELS: {[key:string]:{[key:number]:string}} = {
    Developer : {1:'一级', 2: '二级',3:'三级',4:'四级'},
    Design:{1:'甲级',2: '乙级',3: '丙级'},
    Construct:{0:'特级',1:'一级',2: '二级',3:'三级'},
    Supervisor:{1:'甲级',2: '乙级',3: '丙级'},
    LandExploration:{1:'甲级',2: '乙级',3: '丙级'},
    FireCheck:{1:'甲级',2: '乙级',3: '丙级'}
}

@Pipe({name: 'joinTypeLabel'})
export class JoinTypeLabelPipe implements PipeTransform {

    transform(value: JoinType) {
        return JoinType[value];
    }
    
}

@Pipe({name: 'levelLabel'})
export class LevelLabelPipe implements PipeTransform {

    transform(value: number, type: JoinType) {
        return LEVELS[type][value]
    }
    
}

@Pipe({name: 'personCardLabel'})
export class PersonCardLabel implements PipeTransform {
    transform(value: PersonIdType) {
        return PersonIdType[value];
    }
}

@Pipe({name: 'groupCardLabel'})
export class GroupCardLabel implements PipeTransform{
    transform(value: GroupIdType) {
        return GroupIdType[value];
    }
}

@Injectable({providedIn: 'root'})
export class DataUtilsService{

    groupIdTypes = Object.keys(GroupIdType).map(key => ({key: key, label:GroupIdType[key]}));

    personIdType = Object.keys(PersonIdType).map(key => ({key: key, label: PersonIdType[key]}));

    joinType = Object.keys(JoinType).map(key => ({key: key, label: JoinType[key]}));

    levelLabel(type:string,level: number):string{
        return LEVELS[type][level];
    }

    splitTypeLabel(types: string): string[]{
        return types.split(" ").filter(key => key.trim() != '').map(key => JoinType[key]);
    }

    getLevels(joinType: string):{[key: number]: string}{
        return LEVELS[joinType]
    }
}


