import cors from 'cors'
import express from 'express'
import analyzeRouter from './routes/analyze'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.use('/api', analyzeRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

export { app }
