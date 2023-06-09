const dataSource = {
    "code": 200,
    "message": "success",
    "data": {
        "id": 0,
        "name": "DataSource",
        "fileType": "RootFolder",
        "isLeaf": false,
        "data": "",
        "children": [
            {
                "id": 5,
                "name": "Relations",
                "isLeaf": false,
                "fileType": "Folder",
                "children": [{
                    "id": 11,
                    "name": "database1.mysql",
                    "icon": "database",
                    "fileType": "File",
                    "isLeaf": true
                }, {
                    "id": 12,
                    "icon": "database",
                    "name": "database2.oracle",
                    "isLeaf": true
                }, {
                    "id": 13,
                    "icon": "database",
                    "name": "database3.postgresql",
                    "isLeaf": true,
                    "fileType": "File"
                }]
            },
            {
                "id": 1,
                "name": "source1",
                "icon": "database",
                "fileType": "File",
                "isLeaf": true
            }, {
                "id": 2,
                "name": "source2",
                "icon": "database",
                "fileType": "File",
                "isLeaf": true
            }, {
                "id": 3,
                "icon": "database",
                "name": "source3",
                "fileType": "File",
                "isLeaf": true
            }, {
                "id": 4,
                "name": "source4",
                "icon": "database",
                "fileType": "File",
                "isLeaf": true
            }
        ]
    }
};

const folderTree = {
    "code": 200,
    "message": "success",
    "data": {
        "id": 0,
        "name": "Molecule-Demo",
        "fileType": "RootFolder",
        "location": "Molecule-Demo",
        "isLeaf": false,
        "data": "",
        "children": [
            {
                "id": 1,
                "name": "test.js",
                "location": "Molecule-Demo/test.js",
                "fileType": "File",
                "isLeaf": true,
                "data": { "language": "javascript", "value": "console.log('Hello World');" }
            }, {
                "id": 2,
                "name": "test.css",
                "fileType": "File",
                "location": "Molecule-Demo/test.css",
                "isLeaf": true,
                "data": { "language": "css", "value": "mo { background-color: var(--workbenchBackground); color: var(--foreground); }" }
            }, {
                "id": 3,
                "name": "index.html",
                "fileType": "File",
                "location": "Molecule-Demo/index.html",
                "isLeaf": true,
                "data": { "language": "html", "value": "<div id=\"molecule\">Hello Molecule</div>" }
            }, {
                "id": 4,
                "name": "test.json",
                "fileType": "File",
                "location": "Molecule-Demo/test.json",
                "isLeaf": true,
                "data": { "language": "json", "value": "{ \"language\": \"json\", \"value\": \"{}\" }" }
            }, {
                "id": 5,
                "name": "Sub Folder",
                "isLeaf": false,
                "fileType": "Folder",
                "location": "Molecule-Demo/Sub Folder",
                "children": [{
                    "id": 11,
                    "name": "test.js",
                    "fileType": "File",
                    "location": "Molecule-Demo/Sub Folder/test.js",
                    "isLeaf": true,
                    "data": { "language": "javascript", "value": "console.log('Hello World');" }
                }, {
                    "id": 12,
                    "name": "test.css",
                    "location": "Molecule-Demo/Sub Folder/test.css",
                    "isLeaf": true,
                    "fileType": "File",
                    "data": { "language": "css", "value": "mo { background-color: var(--workbenchBackground); color: var(--foreground); }" }
                }, {
                    "id": 13,
                    "name": "index.html",
                    "location": "Molecule-Demo/Sub Folder/index.html",
                    "isLeaf": true,
                    "fileType": "File",
                    "data": { "language": "html", "value": "<div id=\"molecule\">Hello Molecule</div>" }
                }, {
                    "id": 14,
                    "name": "test.json",
                    "location": "Molecule-Demo/Sub Folder/test.json",
                    "isLeaf": true,
                    "fileType": "File",
                    "data": { "language": "json", "value": "{ \"language\": \"json\", \"value\": \"{}\" }" }
                }]
            }
        ]
    }
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

    getDataSourceById(sourceId: string): Promise<DataSourceType> {
        return new Promise<DataSourceType>((resolve, reject) => {
            const mockDataSource: DataSourceType = {
                id: sourceId,
                name: `dataSource` + sourceId,
                type: 'MySQL',
                jdbcUrl: 'http://jdbc:127.0.0.1//3306',
                updateTime: Date.now() + ''
            }
            resolve(mockDataSource)
        });
    },

    createDataSource(dataSource: Omit<DataSourceType, 'id'>) {
        return new Promise((resolve, reject) => {
            resolve({
                code: 200,
                message: 'success',
                data: dataSource
            })
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
                nodeItem.children.forEach((item: any) => { search(item) })
            }
        }
        search(res.data);

        return result;
    }
}

export default api;