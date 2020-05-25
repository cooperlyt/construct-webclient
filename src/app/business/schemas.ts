export declare class ProcessDefinition {
  id: string;
  name: string;
  key: string;
  category:string;
  description:string;
  version:number;
  resource:string;
  deploymentId:string;
  diagram:string;
  suspended: string;
  tenantId:string;
  versionTag:string;
  historyTimeToLive:number;
  startableInTasklist:boolean;
}

export declare class ProcessInstance {
  id:string;
  definitionId: string;
  businessKey: string;
  caseInstanceId: string;
  ended: boolean;
  suspended: boolean;
  tenantId: string;
}

export declare class Task {
  id: string;
  name: string;
  assignee: string;
  owner:string;
  created: Date;
  due: string;
  followUp: string;
  delegationState: string;
  description: string;
  executionId: string;
  parentTaskId:string;
  priority: number;
  processDefinitionId: string;
  processInstanceId: string;
  caseExecutionId: string;
  caseDefinitionId: string;
  caseInstanceId: string;
  taskDefinitionKey: string;
  suspended: boolean;
  formKey: string;
  tenantId: string;
}

export class BusinessFile{
  id:string;
  md5:string;
  time:Date;
  type:string;
  size:number;
  extName:string;
}

export class BusinessDocumentBase{
  id?: number;
  name:string;
  description?: string;
  need?: boolean;
  pageCount?: number;
}

export class BusinessDocument extends BusinessDocumentBase{
  files: BusinessFile[];
}
