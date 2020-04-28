const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

//To use static data such as css and images, we need to include an express function called static.
//In .html file the link addresses now should be writtens wrt public folder.
app.use(express.static("public"));      //public is the folder name that contains the static files
app.use(bodyparser.urlencoded({extended:true}));
app.get("/", function(req, res)
{
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res)
{
    const firstName = req.body.fname;
    const lastName = req.body.sname;
    const mailId = req.body.emailname;

    const data = 
    {
        members: 
        [
            {
                //array of objects
                //single object here cos we are only going to subscribe one person at a time
                email_address: mailId,
                status: "subscribed",
                merge_fields:       //object type
                {
                    FNAME: firstName,
                    LNAME: lastName,    
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);  //converting data into json file
    const url = "https://us8.api.mailchimp.com/3.0/lists/0a7520d5f1";
    const options = 
    {
        method: "POST",
        auth: "Shubh001:09824c3bb2f50726a497ddf79ff34370-us8"
    }
    const request = https.request(url, options, function(response)
    {
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data", function(data)
        {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res)
{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function()
{
    console.log("Server is up and running at port 3000.");
});

//API KEY- 09824c3bb2f50726a497ddf79ff34370-us8
//ListID- 0a7520d5f1