#!/usr/bin/env node
import { NotFound, type Events, EventType } from './types'

const username = process.argv[2]

if (username === undefined) {
  throw new TypeError('username is undefined')
}

const API_URL = `https://api.github.com/users/${username}/events`

function isNotFound (data: any): data is NotFound {
  return (data as NotFound).status !== undefined && (data as NotFound).message !== undefined
}

function isEmptyArray (data: any): data is any[] {
  return data.length === 0
}

const response = await fetch(API_URL)
const data: Events[] | NotFound = await response.json()

isEmptyArray(data) && console.error(`${username} has no events`)

isNotFound(data)
  ? console.error(`user: ${username} is ${data.message}`)
  : data.forEach(event => {
    switch (event.type) {
      case EventType.CreateEvent:
        event.payload.ref_type === 'branch' &&
        console.log(`- Created a new branch in ${event.repo.name}`)
        event.payload.ref_type === 'tag' &&
        console.log(`- Created a new tag in ${event.repo.name}`)
        event.payload.ref_type === 'repository' &&
        console.log(`- Created a new repository in ${event.repo.name}`)
        break
      case EventType.PushEvent:
        event.payload.size !== undefined && event.payload.size > 1
          ? console.log(`- Pushed ${event.payload.size} commits to ${event.repo.name}`)
          : console.log(`- Pushed 1 commit to ${event.repo.name}`)
        break
      case EventType.IssuesEvent:
        event.payload.action === 'closed' &&
          console.log(`- Closed an issue in ${event.repo.name}`)
        event.payload.action === 'opened' &&
          console.log(`- Opened a new issue in ${event.repo.name}`)
        break
      case EventType.IssueCommentEvent:
        console.log(`- Created a new comment on issue in ${event.repo.name}`)
        break
      case EventType.PullRequestEvent:
        event.payload.action === 'closed' &&
          console.log(`- Closed a pull request in ${event.repo.name}`)
        event.payload.action === 'opened' &&
          console.log(`- Opened a pull request in ${event.repo.name}`)
        break
      case EventType.WatchEvent:
        console.log(`- Starred ${event.repo.name}`)
        break
      case EventType.MemberEvent:
        event.payload.action === 'added' && event.payload.member !== undefined &&
        console.log(`- Added ${event.payload.member.login} as a new member in ${event.repo.name}`)
        break
      case EventType.PullRequestReviewEvent:
        event.payload.action === 'created' &&
        console.log(`- Created a new pull request review in ${event.repo.name}`)
        break
      default:
        console.log(event.type)
        break
    }
  })
