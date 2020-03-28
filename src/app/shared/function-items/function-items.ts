import {Injectable} from '@angular/core';

export interface FunctionItem {
  /** Id of the doc item. Used in the URL for linking to the doc. */
  id: string;
  /** Display name of the doc item. */
  name: string;
  /** Short summary of the doc item. */
  summary?: string;

  roles?: string[];
}

export interface FunctionCategory {
  id: string;
  name: string;
  items: FunctionItem[];
  summary?: string;

  roles?: string[];
}



const CDK = 'cdk';
const COMPONENTS = 'components';



const FUNCTIONS:  FunctionCategory[] = 
  [
    {
      id: 'project',
      name: '建设工程备案',
      summary: '建设工程备案.',
      items: [
        {
          id: 'project',
          name: '工程项目',
          summary: '工程项目.'
        },
        {
          id: 'corp',
          name: '参建单位',
          summary: '参建单位.'
        }
      ]
    },
    {
      id: 'fire',
      name: '消防质检',
      summary: '消防质检.',
      items: [
        {
          id: 'templete',
          name: '质检模版',
          summary: '质检模版.'
        },
        {
          id: 'business',
          name: '检测业务',
          summary: '检测业务.',
        }
      ]
    },
    {
      id: 'quality',
      name: '工程质检',
      summary: '工程质检.',
      items: [
        {
          id: 'params',
          name: '质检参数',
          summary: '质检参数.'
        },
        {
          id: 'business',
          name: '质检业务',
          summary: '质检业务.'
        }
      ]
    },
    {
      id: 'files',
      name: '档案管理',
      summary: '档案管理.',
      items: [
        {
          id: 'room',
          name: '档案室'
        },
        {
          id: 'business',
          name: '档案业务'
        }
      ]
    },
    {
      id: 'setting',
      name: '系统设置',
      summary: '系统设置.',
      items: [
        {
          id: 'employee',
          name: '员工管理',
          summary: '员工管理.'
        },
        {
          id: 'config',
          name: '系统设置',
          summary: '系统设置.'
        }
      ]
    }
  ];

const ALL_FUNCTIONS_ITEM = FUNCTIONS.reduce(
    (result: FunctionItem[], category: FunctionCategory) => result.concat(category.items), []);

@Injectable({providedIn: 'root'})
export class FunctionItems {
  getCategories(): FunctionCategory[] {
    return FUNCTIONS;
  }

  getItems(section: string): FunctionItem[] {
    return ALL_FUNCTIONS_ITEM;
  }

  getItemById(id: string): FunctionItem | undefined {
    return ALL_FUNCTIONS_ITEM.find(f => f.id === id);
  }

  getCategoryById(id: string): FunctionCategory | undefined {
    return FUNCTIONS.find(c => c.id === id);
  }
}
