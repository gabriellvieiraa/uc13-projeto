import 'dotenv/config'; //chaves
import express from 'express'; //framework
import cors from 'cors'; //ele vai permitir a comunicação com frontend
import companieRouter from './routes/companie.js'
import routerCourse from './routes/course.js'
import routerCategorie from './routes/categorie.js'
import routerUser from './routes/user.js'

const app = express() //estou criando o app
app.use(cors()); //aqui eu falo qual cors
app.use(express.json()); //aqui eu falo o formato do json

app.use('/companie',companieRouter); 
app.use('/course',routerCourse); 
app.use('/categorie', routerCategorie);  
app.use('/user', routerUser);  
                                       //USER,COMPANIE,ETC


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HTTP => http://localhost:${PORT}`))