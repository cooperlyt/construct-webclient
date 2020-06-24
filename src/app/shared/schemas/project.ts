import { GroupIdType } from './define';
import { Corp } from './corp';

export declare class JoinCorpInfo{
    name:string;
    groupIdType: GroupIdType;
    groupId: string;
    level: number;
    ownerName: string;
    ownerIdType: string;
    ownerId: string;
}

export declare class JoinCorp{
    property: string;
    outsideTeamFile: string;
    outLevel: boolean;
    outLevelFile:string;
    code:number;
    contacts:string;
    tel:string;
    info:JoinCorpInfo;

    // reg?: ProjectCorpReg;
}

export declare class JoinCorpRegSummary{
    property: string;
    code: number;
    name: string;
    idType: string;//GroupIdType;
    id: string;
}


export declare class JoinCorpReg{
    id:number;
    regTime: Date;
    corpSummary?:JoinCorpRegSummary;
    project?:Project;
    corps?: JoinCorp[];
}

export declare class JoinCorpAndReg{
    joinCorp: JoinCorp;
    corp: Corp;
}

// export declare class ProjectCorpReg{
//     corpSummary: JoinCorpRegSummary[];
//     id: number;
//     regTime: Date;
//     corps: JoinCorp[];

//     project?:Project;
// }

export declare class BuildRegInfo{
    operation: string;//emum
    code?: number;
    info?: BuildInfo;
}

export declare class BuildInfo{
    name: string;
    structure: string; //enum
    onCount:number;
    underCount: number;
    landArea: number;
    onArea:number;
    underArea:number;
    height:number;
}

export declare class BuildReg{
    id: number;
    regTime: Date;
    builds?:BuildRegInfo[];
    count?:number;
    onArea:number;
    underArea:number;
}

export declare class Build{
    code: number;
    regTime: Date;
    enable: boolean;
    projectCode: number;
    info: BuildInfo;
}


export declare class ProjectRegInfo{

    id: number;
    regTime: Date;
    property: string;
    modifyFit: boolean;
    modifyWarm: boolean;
    modifyUse: boolean;
    name:string;
    address:string;
    type: string; //projectType
    typeLevel: number;
    landArea: number;
    beginDate: Date;
    completeDate:Date;
    tender:string;
    costs:number;
    importantType:string;
    importantFile:string;
}

export declare class Project{
    code: number;
    enable: boolean;
    info: ProjectRegInfo;
    corps?: JoinCorp[];
    corp?: JoinCorpReg;
    builds?: BuildRegInfo[];
    build?:BuildReg;
    developer: JoinCorp;
    regTime: Date;
}

export declare class ProjectReg{
    id: number;
    status: string; //RegStatus;
    code: number;
    applyTime: Date;
    regTime: Date;
    source: string;//RegSource;
    type: string; // 
    corp: JoinCorpReg;
    info: ProjectRegInfo;
    build: BuildReg;
    corpMaster: boolean;
    infoMaster: boolean;
}

export declare class ProjectAndCorp{
    project: Project;
    corps: Corp[]
}