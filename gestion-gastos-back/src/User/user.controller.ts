import { Request, Response, NextFunction } from 'express'
import { User } from './user.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

function sanitizeCharacterInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const users = await em.find(
      User,
      {},
    )
    res.status(200).json({ message: 'found all characters', data: users })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const user = em.create(User, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'usuario creado', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export { sanitizeCharacterInput, findAll, add }