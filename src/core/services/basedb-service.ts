import _const from '../enums/const';

export enum StoreName {
    PROJECTS,
    LYRICS
}

const KeyPath : string[] = [
    "projects",
    "lyrics"
]

export default abstract class BaseDbService {
    protected db: IDBDatabase | null = null
    protected storeName: StoreName

    constructor(storeName: StoreName) {
        this.storeName = storeName
    }

    private getStoreName(): string {
        return KeyPath[this.storeName];
    }

    protected initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(_const.DB_NAME, _const.DB_VERSION)

            request.onerror = () => {
                reject(request.error)
                console.error('Error opening IndexedDB:', request.error)
            }
            request.onsuccess = () => {
                this.db = request.result
                resolve()
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                console.log('Upgrading IndexedDB schema')
                for(const value of KeyPath) {
                    if (!db.objectStoreNames.contains(value)) {
                        db.createObjectStore(value, { keyPath: 'id' })
                    }
                }
            };
        });
    }

     

    protected readOnlyOperation<T>(operation: (objectStore: IDBObjectStore) => IDBRequest<T>): Promise<T> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.getStoreName(), 'readonly');
            const objectStore = transaction.objectStore(this.getStoreName());

            const request = operation(objectStore);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    protected async clear(): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction([this.getStoreName()], 'readwrite');
        const objectStore = transaction.objectStore(this.getStoreName());
        const request = objectStore.clear();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    protected saveOperation<T>(value: T): Promise<void> {
        return this.saveAllOperation([value]);
    }

    protected saveAllOperation<T>(value: T[]): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.getStoreName()], 'readwrite');
            const objectStore = transaction.objectStore(this.getStoreName());

            for (const item of value) {
                objectStore.put(item);
            }

            transaction.onerror = () => reject(transaction.error);
            transaction.oncomplete = () => resolve();
        });
    }

    protected deleteOperation<T>(id: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.getStoreName()], 'readwrite');
            const objectStore = transaction.objectStore(this.getStoreName());

            const request = objectStore.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}