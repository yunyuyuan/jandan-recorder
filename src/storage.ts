export type StorageItem = {
  isCreate: boolean,
  url: string,
  content: string,
  timestamp: number,
  oo?: number,
  xx?: number,
  approved?: boolean,
}

const list: StorageItem[] = [];
const StorageKey = 'jandan-recorder';


export function getList() {
  return list;
}

export function storageInit() {
  try {
    list.splice(0, 0, ...(JSON.parse(localStorage.getItem(StorageKey) || '[]')))
  } catch {}
}

export function updateStorage(newItem?: StorageItem) {
  newItem && list.push(newItem);
  localStorage.setItem(StorageKey, JSON.stringify(list));
}
