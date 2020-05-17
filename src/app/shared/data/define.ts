import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';

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

enum FLoorType{
    SINGLE = "单层",
    MULTI = "多层",
    HEIGHT = "高层"
}

enum ProjectProperty{
    NEW = "新建", 
    MODIFY = "改建", 
    BIG = "扩建", 
    MOVE = "迁建", 
    TEMP = "临建" 
}

enum ProjectModifyType{
    FIT_UP = "装修",
    INSULATED = "建筑保温",
    CHANGE = "改变用途"
}

enum ImportantType{
    NORMAL = "非重点项目",
    COUNTY = "国家级重点项目", 
    PROVINCE = "省级重点项目",
    CITY = "市级重点项目"
}

enum ProjectStruct{
    WOOD ="木结构",
    MASONRY = "砌体结构",
    CONCRETE = "钢筋混凝土结构",
    STEEL = "钢结构",
    STEEL_CONCRETE = "钢-混凝土混合结构",
    BRICK = "砖混结构",
    BRICK_WOOD =  "砖木结构"
}

enum ProjectTypeClass{
    CIVIL = "民用建筑",
    INDUSTRY = "工业建筑",
    PEOPLE =  "人防工程",
    BOILER = "锅炉房",
    APPENDAGE = "构筑物"
}



const PROJECT_TYPES: {[key:string]:{label: string, group:ProjectTypeClass, needFloor: boolean, needStruct: boolean}} = {

    CIVIL_HOUSE: {label: "住宅", group: ProjectTypeClass.CIVIL, needFloor:true , needStruct: true },
    CIVIL_COMMON: {label: "公用建筑", group: ProjectTypeClass.CIVIL, needFloor: true, needStruct: false},
    CIVIL_OTHER: {label: "特殊建筑", group: ProjectTypeClass.CIVIL, needFloor:false , needStruct: false},
    INDUSTRY: {label: "厂房", group: ProjectTypeClass.INDUSTRY, needFloor:true , needStruct: true},
    BOILER: {label: "锅炉房", group: ProjectTypeClass.BOILER, needFloor:false , needStruct: false},
    PEOPLE: {label: "人防工程", group: ProjectTypeClass.PEOPLE, needFloor:false , needStruct: false},

    APPENDAGE_CHIMNEY: {label: "烟囱", group: ProjectTypeClass.APPENDAGE, needFloor:false , needStruct: true},
    APPENDAGE_TOWER: {label: "水塔", group: ProjectTypeClass.APPENDAGE, needFloor:false , needStruct: false},
    APPENDAGE_STORE: {label: "贮仓", group: ProjectTypeClass.APPENDAGE, needFloor:false , needStruct: false},
    APPENDAGE_WATER: {label: "贮池", group: ProjectTypeClass.APPENDAGE, needFloor:false , needStruct: false},
}

const TYPE_LEVEL:{[key:number]:string} = {
    1: "一类",
    2: "二类",
    3: "三类",
    4: "四类"
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

    transform(value: string) {
        return JoinType[value];
    }
    
}

@Pipe({name: 'levelLabel'})
export class LevelLabelPipe implements PipeTransform {

    transform(value: number, type: string) {
        return LEVELS[type][value]
    }
    
}

@Pipe({name: 'personCardLabel'})
export class PersonCardLabelPipe implements PipeTransform {
    transform(value: string) {
        return PersonIdType[value];
    }
}

@Pipe({name: 'groupCardLabel'})
export class GroupCardLabelPipe implements PipeTransform{
    transform(value: string) {
        return GroupIdType[value];
    }
}

@Pipe({name: "levelKeyValue"})
export class LevelKeyLabelPipe implements PipeTransform{
    transform(value: string):{key:number,label: string}[]{
        return Object.keys(LEVELS[value]).map(key => ({key: Number(key), label: LEVELS[value][key]}));
    }
}

@Pipe({name: "projectPropertyLabel"})
export class ProjectPropertyLabelPipe implements PipeTransform{
    transform(value: string) {
        return ProjectProperty[value];
    }
}

@Pipe({name: "projectModifyTypeLabel"})
export class ProjectModifyTypeLabelPipe implements PipeTransform{
    transform(value: string) {
        return ProjectModifyType[value];
    }

}

@Pipe({name: "projectTypeClassLabel"})
export class ProjectTypeClassLabelPipe implements PipeTransform{
    transform(value: string) {
        return ProjectTypeClass[value]
    }
}

@Pipe({name: 'projectTypeLabel'})
export class ProjectTypeLabelPipe implements PipeTransform{
    transform(value: string) {
        return PROJECT_TYPES[value].group + '-' + PROJECT_TYPES[value].label;
    }
}

@Pipe({name: 'improtantTypeLabel'})
export class ImportantTypeLabelPipe implements PipeTransform{
    transform(value: string) {
        return ImportantType[value];
    }
}

@Pipe({name: "floorTypeLabel"})
export class FloorTypePipe implements PipeTransform{
    transform(value: string) {
        return FLoorType[value];
    }
}

@Pipe({name: 'projectTypeLevelLabel'})
export class ProjectTypeLevelLabelPipe implements PipeTransform{
    transform(value: number) {
        return TYPE_LEVEL[value];
    }
}

@Pipe({name:'structLabel'})
export class StructLabelPipe implements PipeTransform{
    transform(value: string) {
        return ProjectStruct[value];
    }
    
}

@Injectable({providedIn: 'root'})
export class DataUtilsService{

    groupIdTypes = Object.keys(GroupIdType).map(key => ({key: key, label:GroupIdType[key]}));

    personIdType = Object.keys(PersonIdType).map(key => ({key: key, label: PersonIdType[key]}));

    joinType = Object.keys(JoinType).map(key => ({key: key, label: JoinType[key]}));

    projectProperties = Object.keys(ProjectProperty).map(key => ({key: key, label:ProjectProperty[key]}));

    propertModifyTypes = Object.keys(ProjectModifyType).map(key => ({key:key, label: ProjectModifyType[key]}));

    floorTypes = Object.keys(FLoorType).map(key => ({key:key,label:FLoorType[key]}));

    importantTypes = Object.keys(ImportantType).map(key => ({key: key, label: ImportantType[key]}) );

    projectMainTypes = Object.keys(ProjectTypeClass).map(key => ({key: key, label: ProjectTypeClass[key]}));

    projectTypeGroups = Object.values(ProjectTypeClass).map(label => ({name: label , types: Object.keys(PROJECT_TYPES).filter(tk => {return PROJECT_TYPES[tk].group == label; }).map(tk => ({key:tk, value: PROJECT_TYPES[tk]})) }));

    projectTypeLevels = Object.keys(TYPE_LEVEL).map(key => ({key: key, label:TYPE_LEVEL[key] }));

    projectStructures = Object.keys(ProjectStruct).map(key => ({key: key, label : ProjectStruct[key]}));

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


