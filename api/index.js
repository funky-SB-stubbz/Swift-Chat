const express= require('express');
const dotenv=require('dotenv');
const mongoose= require('mongoose')
const jwt=require('jsonwebtoken')
const User= require('./models/User')
const cors=require('cors');
const cookieParser = require('cookie-parser');
const bcrypt= require('bcryptjs')
const ws= require('ws')


dotenv.config();
// console.log(process.env.JWT_SECRET)
const jwtSecret=process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URL)

const bcryptSalt=bcrypt.genSaltSync();
const app =express();

const port= 3000;
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL,
}))
app.use(cookieParser())

app.get('/test',(req,res)=>{
    // res.json('working');
    res.send('for sure')
    res.end()
})

app.post('/register',async(req,res)=>{
    const {username,password}= req.body;
    const hashedPassword=bcrypt.hashSync(password,bcryptSalt)
    const createdUser = await User.create({
        username,
        password:hashedPassword});
    console.log('user created in mongodb')
    // res.json()
    // await jwt.sign({userId:createdUser,_id},jwtSecret)
    jwt.sign({userId:createdUser._id,username},jwtSecret,{},(err,token)=>{
        if(err) throw err;
        res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
            id:createdUser._id,
            username,
        });
    });

})


app.post('/login',async(req,res)=>{
    const {username,password}= req.body;
    const foundUser=await User.findOne({username});
    if(foundUser){
        const passOk=bcrypt.compareSync(password,foundUser.password);
        if(passOk){
            jwt.sign({userId:foundUser._id,username},jwtSecret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token,{sameSite:'none',secure:true}).status(201).json({
            id:foundUser._id,
            username,
        });
        console.log("Logged In!!!!!!")
            })
        }
    }

})



app.get('/profile',(req,res)=>{
    const token=req.cookies?.token;
    if(token){
        jwt.verify(token,jwtSecret,{},(err,userData)=>{
        if(err) throw err;
        res.json(userData);
    })
    }else{
        res.status(401).json('no token');
    }
    
})




const server=app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})


//>


const wss=new ws.WebSocketServer({server});

wss.on('connection',(connection,req)=>{
    //READ USERNAME AND ID FROM THE COOKIE FOR THIS CONNECTION
    const cookies= req.headers.cookie;
    if(cookies){
        const tokenCookieString=cookies.split(';').find(str=>str.startsWith('token='));
        if(tokenCookieString){
            const token= tokenCookieString.split('=')[1];
            if(token){
                jwt.verify(token,jwtSecret,{},(err,userData)=>{
                    if(err) throw err;
                    // console.log(userData);
                    const {userId,username}= userData;
                    connection.userId=userId;
                    connection.username=username;
                })
            }
        }
    }

    //NOTIFY EVERYONE ABOUT ONLINE PEOPLE (WHEN SOMEONE CONNECTS)
    [...wss.clients].forEach(client=>{
        client.send(JSON.stringify({
            online: [...wss.clients].map(c=>({userId:c.userId,username:c.username}))
        }
            
        )) 
    })

    connection.on('message',(message,isBinary)=>{
        // console.log(message.toString);
        const messageData=JSON.parse(message.toString())
        // connection.send(JSON.stringify(messageData))
        const{sender,recipient,text}=messageData;
        if(recipient && text){
            [...wss.clients].filter(c=>c.userId===recipient)
            .forEach(c=>c.send(JSON.stringify({sender,recipient,text})))
        }
        console.log(messageData)
    })
    
})



//McwfCleXCkUpH88X