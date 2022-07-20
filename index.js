const express= require('express')
const fileUpload = require('express-fileupload')
const app = express()
const cloudinary = require('cloudinary').v2

cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME // if we use env method
    cloud_name: "lco-pro-backend",
    api_key: "287992533756971",
    api_secret: "ZcBmhUYNXO4x-uLrTVbVlZseMwM"
});


app.set('view engine', 'ejs')

// declare middlesware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))
app.get("/myget", (req, res) => {
    console.log(req.body);
    res.send(req.query);
}) 

app.post("/mypost", async (req, res) => {
    console.log(req.body);
    console.log(req.files)

    let results = [];
    let imageArray = []

    // Case for handling multiple images
    if(req.files){
        for (let index = 0; index < req.files.samplefile.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath, {
                folder: "users"
            })
            imageArray.push({
                public_id: result.public_id,
                secure_url: result.secure_url,

            })
            results.push(result)
        }
    }

    // This is used for hadling single file 
    // let file = req.files.samplefile
    // result = await cloudinary.uploader.upload(file.tempFilePath, {
    //     folder: 'users'
    // })
    
    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        results,
        imageArray
    }
    console.log(details);
    res.send(details);
}) 


app.get("/mygetform", (req, res)=>{
    res.render("getform")  // -> here it automatically looks into views dir 
})

app.get("/mypostform", (req, res)=>{
    res.render("postform")  // -> here it automatically looks into views dir 
})


app.listen(4000, () => console.log(`Server Runs at PORT 4000`)) 