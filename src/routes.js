import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const {title, description} = req.body

      if ((!title) || (!description)){
        return res.writeHead(400).end(JSON.stringify({
          error: "Some parameters are missing on request body"
        }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date,
        updated_at: new Date,
        completed_at: null
      }

      database.insert('tasks',task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res
      .end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params
      const {title, description} = req.body

      if (title && description){
        return res.writeHead(400).end(JSON.stringify({
          error: "must send only one parameter"
        }))
      }

      const task = database.select('tasks', {id})

      if (task.length == 0) {
        return res.writeHead(404).end(JSON.stringify({
          error: "task not found"
        }))
      }

      const updated_task = database.update('tasks', id, {
        updated_at: new Date,
        ... title && {title},
        ... description && {description}
      })

      return res.writeHead(200).end(JSON.stringify(updated_task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {id} = req.params

      const task = database.select('tasks', {id})

      if (task.length == 0) {
        return res.writeHead(404).end(JSON.stringify({
          error: "task not found"
        }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {id} = req.params

      const task = database.select('tasks', {id})

      if (task.length == 0) {
        return res.writeHead(404).end(JSON.stringify({
          error: "task not found"
        }))
      }

      const updated_task = database.update('tasks', id, {
        completed_at: !task[0].completed_at ? new Date : null
      })

      return res.writeHead(200).end(JSON.stringify(updated_task))
    }
  }
]
