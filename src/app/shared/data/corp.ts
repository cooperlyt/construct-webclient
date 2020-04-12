

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
    
    regTo: Date;
    level: number;
    levelNumber: string;

}

export declare class CorpReg{

    id: {type: string, // JoinType
         corp?: Corp}
    info: RegInfo;
}

export declare class Corp{
    corpCode: number;
    enable: boolean;
    info: CorpInfo;
    types: string;
    dataTime: Date;
    regs: CorpReg[];
}

export declare class BusinessReg{
    id: {type: string,//JoinType,
         business?: CorpBusiness}
    operateType: string;//OperateType;
    info: RegInfo;
}

export declare class CorpBusiness{
    id: number;
    applyTime: Date;
    regTime: Date;
    source: string;//BusinessSource;
    status: string;//BusinessStatus;
    info: boolean;
    corpInfo: number;
    regs: BusinessReg[];
    corpCode: string;
}
