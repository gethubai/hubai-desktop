const dataSource = {
  code: 200,
  message: 'success',
  data: {
    id: 0,
    name: 'DataSource',
    fileType: 'RootFolder',
    isLeaf: false,
    data: '',
    children: [
      {
        id: 5,
        name: 'Interview Assist Extension',
        isLeaf: false,
        fileType: 'Folder',
        icon: 'comment',
        children: [
          {
            id: 51,
            name: 'Whats the difference between value...',
            icon: 'comment-discussion',
            fileType: 'File',
            isLeaf: true,
          },
          {
            id: 52,
            icon: 'comment-discussion',
            name: 'Provide an example of caching when...',
            isLeaf: true,
          },
          {
            id: 53,
            icon: 'comment-discussion',
            name: 'Testing if speech to text is working c...',
            isLeaf: true,
            fileType: 'File',
          },
        ],
      },
      {
        id: 6,
        name: 'Chat GPT',
        isLeaf: false,
        fileType: 'Folder',
        icon: 'comment',
        children: [
          {
            id: 61,
            name: 'How can I build something with...',
            icon: 'comment-discussion',
            fileType: 'File',
            isLeaf: true,
          },
          {
            id: 62,
            icon: 'comment-discussion',
            name: 'Are we going to be rich?',
            isLeaf: true,
          },
        ],
      },
    ],
  },
};

const folderTree = {
  code: 200,
  message: 'success',
  data: {
    id: 0,
    name: 'Molecule-Demo',
    fileType: 'RootFolder',
    location: 'Molecule-Demo',
    isLeaf: false,
    data: '',
    children: [
      {
        id: 1,
        name: 'test.js',
        location: 'Molecule-Demo/test.js',
        fileType: 'File',
        isLeaf: true,
        data: { language: 'javascript', value: "console.log('Hello World');" },
      },
      {
        id: 2,
        name: 'test.css',
        fileType: 'File',
        location: 'Molecule-Demo/test.css',
        isLeaf: true,
        data: {
          language: 'css',
          value:
            'mo { background-color: var(--workbenchBackground); color: var(--foreground); }',
        },
      },
      {
        id: 3,
        name: 'index.html',
        fileType: 'File',
        location: 'Molecule-Demo/index.html',
        isLeaf: true,
        data: {
          language: 'html',
          value: '<div id="molecule">Hello Molecule</div>',
        },
      },
      {
        id: 4,
        name: 'test.json',
        fileType: 'File',
        location: 'Molecule-Demo/test.json',
        isLeaf: true,
        data: {
          language: 'json',
          value: '{ "language": "json", "value": "{}" }',
        },
      },
      {
        id: 5,
        name: 'Sub Folder',
        isLeaf: false,
        fileType: 'Folder',
        location: 'Molecule-Demo/Sub Folder',
        children: [
          {
            id: 11,
            name: 'test.js',
            fileType: 'File',
            location: 'Molecule-Demo/Sub Folder/test.js',
            isLeaf: true,
            data: {
              language: 'javascript',
              value: "console.log('Hello World');",
            },
          },
          {
            id: 12,
            name: 'test.css',
            location: 'Molecule-Demo/Sub Folder/test.css',
            isLeaf: true,
            fileType: 'File',
            data: {
              language: 'css',
              value:
                'mo { background-color: var(--workbenchBackground); color: var(--foreground); }',
            },
          },
          {
            id: 13,
            name: 'index.html',
            location: 'Molecule-Demo/Sub Folder/index.html',
            isLeaf: true,
            fileType: 'File',
            data: {
              language: 'html',
              value: '<div id="molecule">Hello Molecule</div>',
            },
          },
          {
            id: 14,
            name: 'test.json',
            location: 'Molecule-Demo/Sub Folder/test.json',
            isLeaf: true,
            fileType: 'File',
            data: {
              language: 'json',
              value: '{ "language": "json", "value": "{}" }',
            },
          },
        ],
      },
    ],
  },
};

const api = {
  getFolderTree() {
    return folderTree;
  },

  search(value: string) {
    return this.query(value);
  },

  getDataSource() {
    return dataSource;
  },

  getDataSourceById(sourceId: string): Promise<DataSourceChatType> {
    return new Promise<DataSourceChatType>((resolve, reject) => {
      const mockDataSource: DataSourceChatType = {
        id: sourceId,
        name: `dataSource${sourceId}`,
        type: 'MySQL',
        jdbcUrl: 'http://jdbc:127.0.0.1//3306',
        updateTime: `${Date.now()}`,
      };
      resolve(mockDataSource);
    });
  },

  createDataSource(dataSource: Omit<DataSourceChatType, 'id'>) {
    return new Promise((resolve, reject) => {
      resolve({
        code: 200,
        message: 'success',
        data: dataSource,
      });
    });
  },

  async query(query: string = '') {
    const res = folderTree;
    const result: any[] = [];
    const search = (nodeItem: any) => {
      if (!nodeItem) return;
      const target = nodeItem.name || '';
      if (target.includes(query) || query.includes(target)) {
        result.push(nodeItem);
      }
      if (nodeItem.children) {
        nodeItem.children.forEach((item: any) => {
          search(item);
        });
      }
    };
    search(res.data);

    return result;
  },
};

export default api;
