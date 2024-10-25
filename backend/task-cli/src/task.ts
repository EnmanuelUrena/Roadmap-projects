import { saveFile, readFile } from './utils/fs.js'

export interface Task {
  id: number
  description: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: Date
  updatedAt: Date
}

export let tasks: Task[] = []

export function readTasks (filePath: string): void {
  tasks = readFile(filePath)
}

export function addTask (description: string, filePath: string): number {
  let taskId: number = 0
  try {
    const newTask: Task = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      description,
      status: 'todo',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now())
    }
    tasks.push(newTask)
    saveFile(tasks, filePath)
    taskId = newTask.id
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
  return taskId
}

export function updateTask (id: number, description: string, filePath: string): void {
  const newTask: Task | undefined = tasks.find((task) => task.id === id)
  if (newTask === undefined) {
    console.error(`task ${id} is not found in list`)
  } else {
    newTask.description = description
    newTask.updatedAt = new Date(Date.now())
    tasks = tasks.map(task => task.id !== newTask.id ? task : newTask)
    saveFile(tasks, filePath)
  }
}

export function deleteTask (id: number, filePath: string): void {
  const filteredTask = tasks.filter((task) => task.id !== id)
  if (filteredTask.length === tasks.length) {
    console.error(`task ${id} is not found in list`)
  } else {
    tasks = filteredTask
    saveFile(tasks, filePath)
  }
}

export function updateTaskStatus (id: number, status: 'todo' | 'in-progress' | 'done', filePath: string): void {
  const newTask: Task | undefined = tasks.find((task) => task.id === id)
  if (newTask === undefined) {
    console.error(`task ${id} is not found in list`)
  } else {
    newTask.status = status
    newTask.updatedAt = new Date(Date.now())
    tasks = tasks.map(task => task.id !== newTask.id ? task : newTask)
    saveFile(tasks, filePath)
  }
}
