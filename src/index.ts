import express, { Request, Response } from 'express'
import filter from './filter'
import { generate } from './generate'
import { json as jsonParser } from 'body-parser'
import cors from './middleware/cors'
import { port } from './config'

let app = express()

app.use(cors())
app.use(jsonParser())

app.post('/', async (req: Request, res: Response) => {
    const validate = filter(req.body)
    if (typeof (validate) === 'string') {
        res.status(400).json({ message: validate })
    } else {
        const data = await generate(validate)
        if (typeof (data) === "string") {
            res.status(500).json({ message: data })
        } else {
            res.status(200).json({ message: 'success', data })
        }
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})