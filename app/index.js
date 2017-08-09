import express from 'express'
import index from './routes/index'


const app = new express()
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index)

const { PORT = 3000 } = process.env;
let server = app.listen(PORT);