//jshint esversion:6
//To use express
const express = require("express");
//To use body-parser for accessing html-elements
const bodyParser = require("body-parser");
//This is used to send and receive http request to API's
const https = require("https");
//General decleration to use express
const app = express();
//Static is used to access the external css files and images
app.use(express.static("public"));
//urlencoded is used to accessor use the html tags
app.use(bodyParser.urlencoded({extended:true}));
//To make get request
app.get("/",function(req,res){
  //__dirname is used to specify the complete html file path when using a server
  res.sendFile(__dirname + "/signup.html");
});
//To make post request
app.post("/",function(req,res){
  //req.body.name get the corresponding inputs from the html form
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  //creation of javascript object to storeor send data to the mailchimp
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  //JSON.stringify is used to convert the javascript object to JSON string
  const jsonData = JSON.stringify(data);
  //API Endpoint with the unique list id at the end
  //Lists is one of the mailchimp API paths
  const url = "https://us19.api.mailchimp.com/3.0/lists/af03cd5fc9";
  //One of the mailchimp API parameters
  const options = {
    method: "post",
    auth: "jeejo:acb52f10410d1b1a078ed770a66a604a-us19"
  };
  //Used to store the request so that we can writeor send the data through API
  const request = https.request(url, options, function(response){
    //response has several attributes and one of them is statusCode
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    //response.on is used to see what we get back from the API
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
  //Used to write our data as JSON in the mailchimp server through their API
  request.write(jsonData);
  //Just to mention that the request have been ended
  request.end();
});
//Used to redirect to home page
app.post("/failure",function(req,res){
  res.redirect("/");
});
//To start the communication port
//process.env.PORT dynamically assigns a port from heroku
//for localport change it to 3000
app.listen(process.env.PORT || 3000 ,function(){
  console.log("Server started at port 3000");
});

// Api key
// acb52f10410d1b1a078ed770a66a604a-us19

// unique id
// af03cd5fc9
