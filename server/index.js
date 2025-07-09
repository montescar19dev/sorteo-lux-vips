import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

app.use(cors())
app.use(express.json())

// Ruta simple para comprobar que el servidor responde
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente')
})

// Conexión a MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Conexión exitosa a MongoDB Atlas')
  // Inicia el servidor solo si se conecta a MongoDB
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
  })
})
.catch((error) => {
  console.error('Error al conectar con MongoDB:', error)
})
