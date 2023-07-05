import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
const app = express()
dotenv.config()
app.use(cors())
app.use(bodyParser.json({limit : '30mb', extended : true}))
app.use(bodyParser.urlencoded({limit : '30mb', extended : true}))

const firstLayerSchema = mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    username : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
})
const First = mongoose.model('First',firstLayerSchema)

app.get('/api/data', async (req,res)=>{
    try {
        const response = await First.find()
        res.status(200).json(response)
    } catch (err) {
        res.status(409).json({message:`${err.message}` })
    }
})
app.get('/api/data/:username', async (req,res)=>{
    try {
        const { username } = req.params;
        const response = await First.findOne({username : username})
        res.status(200).json(response)
    } catch (err) {
        res.status(409).json({message:`${err.message}` })
    }
})
app.post('/api/data', async (req,res)=>{
    try {
        let data = req.body
        if(Object.keys(data).length === 0){return res.status(400).json("Invalid Data")}
        const post = new First(data)
        await post.save()
        res.status(200).json(post)

    } catch (err) {
        res.status(409).json({message:err.message })
    }
   
})
app.post('/api/data/query/', async (req,res)=>{
    try {
        let data = req.query
        if(Object.keys(data).length === 0){return res.status(400).json("Invalid Data")}
        const post = new First(data)
        await post.save()
        res.status(200).json(post)

    } catch (err) {
        res.status(409).json({message:err.message })
    }
   
})

const PORT =  8080
const connectDB = async () => {
    try {
        const con = await mongoose.connect('mongodb://127.0.0.1:27017/testserver', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`Mongo DB Connected : ${con.connection.host}`)
        app.listen(PORT,()=> console.log(`Server Listening on port : ${PORT}`))
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
connectDB()