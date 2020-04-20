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

export enum RegSource{
    Import = "数据整理",
    Patch = "补录",
    Inside = "备案业务",
    Outside = "备案申请"
}

export enum RegStatus{
    Prepare = "准备中",
    Abort = "终止",
    Running = "运行中",
    Register = "已备案",
    Invalid = "无效"
}

export enum OperateType{
    DELETE = "移除",
    MODIFY = "修改",
    CREATE = "创建",
    QUOTED = "引用"
}

export enum FLoorType{
    SINGLE = "单层",
    MULTI = "多层",
    HEIGHT = "高层"
}

export enum ProjectProperty{
    NEW = "新建", 
    MODIFY = "改建", 
    BIG = "扩建", 
    MOVE = "迁建", 
    TEMP = "临建" 
}

export enum ImportType{
    NORMAL = "非重点项目",
    COUNTY = "国家级重点项目", 
    PROVINCE = "省级重点项目",
    CITY = "市级重点项目"
}

export declare class ProjectMainType {
    [key:string]: {label:string, needLevel:boolean }
}

export const projectMainTypes:ProjectMainType[] = [
    {CIVIL: {label : "民用建筑", needLevel: true }},
    {INDUSTRY: {label : "工业建筑", needLevel: true }},
    {INDUSTRY: {label : "人防工程", needLevel: true }},
    {INDUSTRY: {label : "锅炉房", needLevel: true }},
    {INDUSTRY: {label : "构筑物", needLevel: true }}
];



export const projectType: {[key:string]:{label: string, group:ProjectMainType}}[] = [

    {CIVIL_HOUSE: {label: "住宅", group: projectMainTypes["CIVIL"]}},
    {CIVIL_COMMON: {label: "公用建筑", group: projectMainTypes["CIVIL"]}},
    {CIVIL_OTHER: {label: "特殊建筑", group: projectMainTypes["CIVIL"]}},

    {INDUSTRY: {label: "公用建筑", group: projectMainTypes["INDUSTRY"]}},

    {BOILER: {label: "锅炉房", group: projectMainTypes["BOILER"]}},

    {PEOPLE: {label: "人防工程", group: projectMainTypes["PEOPLE"]}},

    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},
    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},
    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},
    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},
    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},
    {APPENDAGE_CHIMNEY_1: {label: "砼烟囱", group: projectMainTypes["APPENDAGE"]}},

]





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

    transform(value: string) {
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
    transform(value: string) {
        return PersonIdType[value];
    }
}

@Pipe({name: 'groupCardLabel'})
export class GroupCardLabel implements PipeTransform{
    transform(value: string) {
        return GroupIdType[value];
    }
}

@Pipe({name: "levelKeyValue"})
export class LevelKeyLabel implements PipeTransform{
    transform(value: string):{key:number,label: string}[]{
        return Object.keys(LEVELS[value]).map(key => ({key: Number(key), label: LEVELS[value][key]}));
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


