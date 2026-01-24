import { openDB } from 'idb';

const DB_NAME = 'anon-task-db';
const STORE_NAME = 'tasks';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function addTask(title: string) {
  const db = await getDB();
  await db.add(STORE_NAME, { title, done: false, createdAt: new Date() });
}

export async function getAllTasks() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function toggleTask(id: number) {
  const db = await getDB();
  const task = await db.get(STORE_NAME, id);
  if (task) {
    task.done = !task.done;
    await db.put(STORE_NAME, task);
  }
}

export async function deleteTask(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
