const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname+'/date.js');
const mongoose = require('mongoose');
const app = express();
const _ = require('lodash');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-abhijeet:Test123@cluster0-yofjn.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema={
	name :{
		type : String,
		required :[true,"Please enter a string"]
	}
}
const Item = mongoose.model("Item",itemsSchema);
const listSchema = {
	name : String,
	items : [itemsSchema]
};
const List = mongoose.model("List",listSchema);
// const item1 = new Item({
// 	name : "Welcome to your to-do list"
// });
// const item2 = new Item({
// 	name : "Hit this to add an item"
// });
// const item3 = new Item({
// 	name : "<--Hit this to delete an item"
// });
// const defaultItems = [item1,item2,item3];
const defaultItems = [];

app.get("/",function(req,res){
	Item.find({},function(err,result){
		if(defaultItems===0){
			Item.insertMany(defaultItems,function(err){
				if(err)
					console.log(err);
				else
					console.log("Successfully saved items to default DB");
			});
			res.render("/");
		}
		else
			res.render("list",{titleName:"Today", taskNames:result});
	});
	// const day = date.getDate();
});

app.post("/",function(req,res){
	const item = new Item({
		name : req.body.newTask
	});
	if(req.body.button === 'Today'){
		item.save();
		res.redirect("/");
	} else{
		List.findOne({name:req.body.button},function(err,result){
			if(!err){
				result.items.push(item);
				result.save();
				res.redirect("/"+req.body.button);
			}
		});
	}
});

app.post("/delete",function(req,res){
	//console.log(req.body);
	// Item.deleteOne({_id:req.body.checkbox},function(err){
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 		console.log("Item deleted Successfully");
	// });

	if(req.body.listName==="Today"){
		Item.findByIdAndRemove(req.body.checkbox,function(err){
			if(!err)
				res.redirect("/")
		});
	}
	else{
		List.findOneAndUpdate( {name:req.body.listName}, {$pull:{items:{_id:req.body.checkbox}}}, function(err,result){
			if(!err)
				res.redirect("/"+req.body.listName);
			})
		};
});

app.get("/:customListName",function(req,res){
	List.findOne({name:_.capitalize(req.params.customListName)},function(err,result){
		if(!err){
			if(!result){
				//console.log("Doesn't exists");
				const list = new List({
					name : _.capitalize(req.params.customListName),
					items : defaultItems
				});
				list.save();
				res.redirect("/"+req.params.customListName);
}			else
				res.render("list",{titleName:result.name, taskNames:result.items});
		}
	});
});

// app.get("/work",function(req,res){
// 	res.render("list",{titleName:"Work list",taskNames:workItems});
// });

app.get("/about",function(req,res){
	res.render("about");
});

app.listen(process.env.PORT || 3000,function(){
	console.log("Server started");
});
