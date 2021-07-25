const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/PRACTICETodolist", {useNewUrlParser: true});

//NEW SCHEMA
const listSchema= {
    name : String
};

//NEW MODEL
const List=mongoose.model("List", listSchema);

//DEFAULT ITEMS
const item1=new List({
    name : "Welcome to todolist"
});

const item2=new List({
    name : "Hit the + button to add new items"
});

const item3=new List({
    name : "Check the BOX to remove items"
});

const defaultItems=[item1, item2, item3];

//NEW SCHEMA
const customList= {
    name: String,
    lists: [listSchema]
}

//NEW MODEL
const Custom=mongoose.model("Custom", customList);

app.get("/", function(req, res){
    

    List.find({}, function(err, foundListItems){

        if(foundListItems.length===0){
            List.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("successfully inserted data");
                }
            });
            res.redirect("/");
        }
        else{
            let title="Main page";
            res.render("list", {head : title, newListItem: foundListItems}); 
        }
        
   });    
});

app.post("/", function(req, res){

   const newItem=req.body.newItem;
   const routeButton=req.body.buttonAdd;
 
   const newTodolistItem=new List({
    name: newItem
    });

    if(routeButton === "Main page"){
        newTodolistItem.save();
        res.redirect("/");
    }
    else{
        Custom.findOne({name: routeButton}, function(err, foundListItem){
            foundListItem.lists.push(newTodolistItem);
            foundListItem.save();
            res.redirect("/" + routeButton);
        });
    }
});

app.get("/work", function(req, res){

    let title="Work"
    res.render("list", {head: title, newListItem: work});
});


app.get("/:customName", function(req, res){

    console.log(req.params.customName);

    const customRoute=req.params.customName;

    Custom.findOne({name: customRoute}, function(err, foundList){
        if(!err){
            if(!foundList){
                const customItem=new Custom({
                    name : customRoute,
                    lists : defaultItems
                });
                customItem.save();
                res.redirect("/" + customRoute);
            }
            else{
                res.render("list", {head : foundList.name, newListItem : foundList.lists});
            }
        }
    });
});


app.post("/delete", function(req, res){
     
    const routeName=req.body.hiddenInput;
    const checkBoxId=req.body.checkbox;
     

    if(routeName==="Main page"){
        List.findByIdAndRemove(checkBoxId, function(err){
            if(!err){
                console.log("deletion is success");
                res.redirect("/");
            }
        });
    }
    else{
        Custom.findOneAndUpdate({ name: routeName}, { $pull: { lists : {_id: checkBoxId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + routeName);
            }
        });
    
    }
});

app.listen(3000, function(){
console.log("server is listening to port 3000");
});