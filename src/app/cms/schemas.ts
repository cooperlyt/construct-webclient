
export class Category{
  id: number;
  name: string;
  description: string;
  parent?: Category;
  children: Category[];
}

export class Document{
  mimeType: string;
  size: number;
  ext: string;
  content: string;
  name: string;
}

export class Article{
  id:number;
  thumbnail: string;
  content: string;
  summary: string;
  title: string;
  subTitle: string;
  tag: string;
  time: Date;
  mimeType: string;
  docSummary: string;
  category: Category;
  documents: Document[];
}