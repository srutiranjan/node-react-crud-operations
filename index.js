const express = require("express");
const app = express();
const cors = require("cors"); 
require('./db/config');

app.use(express.json({extended: false}));
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
const User = require('./db/users');
const Product = require('./db/product')
app.post('/register',async (req,resp)=>{
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
})
app.post("/login", async (req, resp) =>{
  
  if(req.body.password && req.body.email){
    let result = await User.findOne(req.body).select('-password');
    if(result){
      resp.send(result);
    }else{
      resp.send({result:"no user found!"})
    }
  }else{
    resp.send({result:"Email and Password not found!"})
  }
  
});

app.post("/add-product", async (req,resp)=>{
  let product = new Product(req.body);
  let result = await product.save(); 
  resp.send(result);

});

app.get('/products',async(req,resp)=>{
  let products = await Product.find();
  if(products.length > 0){
    resp.send(products);
  }else{
    resp.send({result:"No result found!"})
  }
})
app.delete('/deleteProduct/:id',async(req,resp)=>{
  let result = await Product.deleteOne({_id:req.params.id})
  resp.send(result);

});
app.get('/getProductById/:id',async(req,resp)=>{
  //console.log(req.params);
  let products = await Product.findOne({_id :req.params.id});
  if(products){
    resp.send(products);
  }else{
    resp.send({result:"No result found!"})
  }
});
app.put('/getProductUpdate/:id',async(req,resp)=>{
  //console.log(req.params);
  let result = await Product.updateOne({_id :req.params.id},{$set:req.body});
  resp.send(result);
})
app.get('/search/:key',async(req,resp)=>{
  let result = await Product.find({
    "$or":[
    {
      name:{$regex:req.params.key}
    },
    {
      category:{$regex:req.params.key}
    },
    {
      company:{$regex:req.params.key}
    }
    ]

  });
  resp.send(result); 
})


app.get('/getToken',verifyToken, async(req,resp)=>{
  let result = await Product.find();
  console.log(result);
  resp.send(result);

})

function verifyToken(req, resp, next){
  return'Jwt Token';

}
app.listen(5000);