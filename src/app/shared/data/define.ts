import { Injectable } from '@angular/core';

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

export enum ConstructJoinType{
    Developer = "开发单位",
    Design = "设计单位",
    Construct = "建设单位",
    Supervisor = "监理单位",
    FireCheck = "防火监理单位",
    LandExploration = "土地勘查单位"
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

enum DeveloperLevel{
    一级 = 1,
    二级 = 2,
    三级 = 3,
    四级 = 4
}


@Injectable()
export class DataUtilsService{

    

    groupIdTypes = Object.keys(GroupIdType).map(key => ({key: key, label:GroupIdType[key]}));

    personIdType = Object.keys(PersonIdType).map(key => ({key: key, label: PersonIdType[key]}));

    getLevel(joinType: ConstructJoinType){
        switch (joinType){
            case ConstructJoinType.Developer: {

                break;
            }
            case ConstructJoinType.Design:{

                break;
            }
        }
    }

}