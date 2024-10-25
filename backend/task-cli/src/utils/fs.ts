import fs from 'node:fs'

import { Task } from '../task.js'

export function saveFile (tasks: Task[], filePath: string): void {
  fs.writeFileSync(filePath, JSON.stringify(tasks))
}

export function readFile (filePath: string): Task[] {
  let tasks: Task[] = []
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      tasks = JSON.parse(fileContent.toString())
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
  }
  return tasks
}
