import express from "express"
import dotenv from "dotenv"
import path, {dirname} from "path"
import { fileURLToPath } from "url";
import axios from "axios"

dotenv.config({path: "./.env"})
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
const token="";
const API_URL = "https://secrets-api.appbrewery.com";
const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}
//application/json
app.use(express.json())
//pre-processing client side request
app.use(express.urlencoded({extended:true}));
//static files
app.use(express.static(path.join(__dirname, "public", "static")));
//request handling
app.get("/", (req, res)=>{
    res.render('index.ejs',{content: "waiting for data...."})
})
//get request - searching for a secret by id
app.post("/get-secret", async (req, res)=>{
    const formDataId = req.body.id;
    // console.log(formDataId)
    try{
        const response = await axios.get(`${API_URL}/secrets/${formDataId}`,config)
        res.render('index.ejs', {content: "Result: " + JSON.stringify(response.data)})
    }catch(error){
        // res.status(500).send("Error")
        res.render("index.ejs", {content: "Error: " + JSON.stringify(error.message)})
    }
})
//post request - adding to the secret
app.post("/post-secret", async (req, res)=>{
    const formData = req.body
    try{
        await axios.post(`${API_URL}/secrets`, formData, config)
        res.render("index.ejs", {content: "...Post successful"})
    }catch(err){
        res.render("index.ejs", {content: `Error: ${JSON.stringify(err.message)}`})
    }
})
//update request - partial update
app.post("/patch-secret", async (req, res)=>{
    const formDataId = req.body.id;
    const formData = req.body;
    try{
        await axios.patch(`${API_URL}/secrets/${formDataId}`, formData, config)
        res.render("index.ejs", {content: `Update Successful`})
    }catch(err){
        res.render("index.ejs", {content: `Error: ${JSON.stringify(err.message)}`})
    }
})
//full update request - put
app.post("/put-secret", async (req, res)=>{
    const formDataId = req.body.id
    const formData = req.body
    try{
        await axios.put(`${API_URL}/secrets/${formDataId}`, formData, config)
        res.render("index.ejs", {content: "Update Successful"})
    }catch(err){
        res.render("index.ejs", {content: `Error: ${JSON.stringify(err.message)}`})
    }
})
//delete request
app.post("/delete-secret", async (req, res)=>{
    const formDataId = req.body.id
    try{
        await axios.delete(`${API_URL}/secrets/${formDataId}`, config)
        res.render("index.ejs", {content: `Deleted post with ID: ${formDataId}`})
    }catch(err){
        res.render("index.ejs", {content: `Error: ${JSON.stringify(err.message)}`})
    }
})
const port = process.env.PORT || 3000
const host = process.env.HOSTNAME || "127.0.0.1"
app.listen(port, host, ()=>{
    console.log(`server started on ${process.env.NODE_ENV} mode. Visit: http://${host}:${port}`)
})