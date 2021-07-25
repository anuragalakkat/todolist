const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");


app.get("/", function(req, res){
    // res.render("list", { newListItem: req.body.newItem});
});

app.post("/", function(req, res){

   let item=req.body.newItem;
   console.log(req.body.newItem);
   res.render("list", { newListItem: req.body.newItem});
});


app.listen(3000, function(){
console.log("server is listening to port 3000");
});