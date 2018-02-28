const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


app.get("/",function(res,rej){
	res.send("We listen!");
});

app.use(express.static(__dirname+"/public"));

app.listen(PORT,function () {
	console.log("Server listens on Port: " + PORT);
});