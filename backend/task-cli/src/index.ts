#!/usr/bin/env node
import { addTask, tasks, updateTask, updateTaskStatus, deleteTask, readTasks } from './task.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const filePath: string = join(dirname(fileURLToPath(import.meta.url)), 'data.json')

const args = process.argv
readTasks(filePath)

let taskId = 0

const showHelp = (): void => {
  console.log(`
  Task CLI - A command-line interface for managing and automating tasks.

  Available commands:
    add <task>                  - Add a new task.
    list                        - Show the task list.
    mark-in-progress <id>       - Mark a task as in progress.
    mark-done <id>              - Mark a task as completed.
    delete <id>                 - Delete a task by id.

  Usage:
    task-cli <command> [arguments]

  Examples:
    task-cli add "Buy milk"        - Add a new task with the títle "Buy milk".
    task-cli list                  - Show all the task list.
    task-cli mark-in-progress 1    - Mark the task with id 1 as in progress.
    task-cli mark-done 1           - Mark the task with id 1 as completed.
    task-cli delete 1              - Delete the task with id 1.
  `)
}

switch (args[2]) {
  case 'add':
    taskId = addTask(args[3], filePath)
    console.log(`task added sucessfully (ID: ${taskId})`)
    break
  case 'update':
    updateTask(Number(args[3]), args[4], filePath)
    break
  case 'mark-in-progress':
    updateTaskStatus(Number(args[3]), 'in-progress', filePath)
    break
  case 'mark-done':
    updateTaskStatus(Number(args[3]), 'done', filePath)
    break
  case 'delete':
    deleteTask(Number(args[3]), filePath)
    break
  case 'list':
    args[3] === 'done'
      ? console.log(tasks.filter(task => task.status === 'done'))
      : args[3] === 'todo'
        ? console.log(tasks.filter(task => task.status === 'todo'))
        : args[3] === 'in-progress'
          ? console.log(tasks.filter(task => task.status === 'in-progress'))
          : console.log(tasks)
    break
  default:
    console.error('Command not found')
    showHelp()
    break
}
