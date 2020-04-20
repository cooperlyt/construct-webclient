

export declare class CorpInfo{
    name: string;
    groupIdType: string; // GroupIdType;
    groupId: string;
    ownerName: string;
    ownerIdType:string;// PersonIdType;
    ownerId: string;
    address: string;
    tel: string;
}

export declare class RegInfo{
    regTime: Date;
    regTo: Date;
    level: number;
    levelNumber: string;

}

export declare class CorpReg{

    info: RegInfo;
    property:string// JoinType
}

export declare class Corp{
    code: number;
    enable: boolean;
    info: CorpInfo;
    types: string;
    regs: CorpReg[];
}

export declare class BusinessReg{

    property: string;//JoinType,
    operateType: string;//OperateType;
    info: RegInfo;
}

export declare class CorpBusiness{
    id: number;
    applyTime: Date;
    regTime: Date;
    source: string;//BusinessSource;
    status: string;//BusinessStatus;
    infoChanged: boolean;
    info: CorpInfo;
    regs: BusinessReg[];
    code: string;
}
