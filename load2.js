import csv from 'csv-parser';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const REDIS_PASS = process.env.REDIS_PASS || 'my_secret_password';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_USER = process.env.REDIS_USER || 'default';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let r = new Redis({
 port: REDIS_PORT,
 host: REDIS_HOST,
 username: REDIS_USER,
 password: REDIS_PASS,
 db: 0,
});
let p = r.pipeline();

fs.createReadStream('data/inscripciones2019.csv')
  .pipe(csv())
  .on('data', data => {
    let { correlativo_estudiante, nombre_carrera, fecha_inscripcion, anio_inscripcion,
        sexo, pais_nacionalidad, tipo_inscripcion } = data

    let id = parseInt(correlativo_estudiante)
    let key = `inscripcion-${id}`
    let values = { correlativo_estudiante, nombre_carrera, fecha_inscripcion, anio_inscripcion,
        sexo, pais_nacionalidad, tipo_inscripcion }

    p.hset(key, values)
    
  })
  .on('end', () => {
    p.exec()
    r.quit()
  })

  console.log("CARGA DEL CSV INSCRIPCIONES A REDIS TERMINADA CON EXITO :D");




