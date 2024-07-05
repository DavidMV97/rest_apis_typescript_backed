import colors from 'colors'
import express from "express"
import cors, { CorsOptions } from 'cors'
import router from "./router"
import db from "./config/db";
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import morgan from 'morgan';

// Conectar a la base de datos
export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.blue('Conexion exitosa a la DB'));
        
    } catch (error) {
        console.log(error);
        console.log(colors.red.bold('Hubo un error conectando a la base de datos'));
    }
}

connectDB()

// Instancia de express
const server = express()

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}

server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))
server.use('/api/products', router)

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server