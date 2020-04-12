import { GroupIdType, PersonIdType, BusinessSource, BusinessStatus, OperateType, JoinType } from './define';


export class CorpInfo{
    name: string;
    groupIdType: GroupIdType;
    groupId: string;
    ownerName: string;
    ownerIdType: PersonIdType;
    ownerId: string;
    address: string;
    tel: string;
}

export class RegInfo{
    
    regTo: Date;
    level: number;
    levelNumber: string;

}

export class CorpReg{

    id: {type: JoinType, corp: Corp}
    info: RegInfo;
}

export class Corp{
    corpCode: number;
    enable: boolean;
    info: CorpInfo;
    types: string;
    dataTime: Date;
    regs: CorpReg[];
}

export class BusinessReg{
    id: {type: JoinType, business: CorpBusiness}
    operateType: OperateType;
    info: RegInfo;
}

export class CorpBusiness{
    id: number;
    applyTime: Date;
    regTime: Date;
    source: BusinessSource;
    status: BusinessStatus;
    info: boolean;
    corpInfo: number;
    regs: BusinessReg[];
    corpCode: string;
}
