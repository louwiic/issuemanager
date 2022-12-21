export type Issue = {
    assignTo: string;
    author: string;
    date: Date;
    priority: 'emergency' | 'normal' | 'higth';
    ref: string;
    request: string;
    status: 'new' | 'inprogress' | 'done';
    type: 'Maintenance';
  };