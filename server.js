// import thư viện 
var data = require('./data');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require("underscore");
const jwt    = require('jsonwebtoken'),
config = require('./configurations/config');
var app = express();
const rateLimit = require("express-rate-limit");
 //jwt-redis
 var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
//////
 
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5
});
//set secret
app.set('Secret', config.secret);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// khai báo cổng chạy dịch vụ
var PORT = process.env.PORT || 3000;
//swagger
app.use(express.static('./dist'));
app.get('/swagger',(req,res)=>{
    res.sendFile('index.html');
})



// app.get('/', function (req, res) {
//     res.send(data);
// });
app.listen(PORT, function () {
    console.log('Express listening on port' + PORT + '!');
});
//---------------
//authencation
app.post('/authenticate',(req,res)=>{
    
    if(req.body.username === "admin"){
        
        if(req.body.password==="123"){
             //if eveything is okey let's create our token 

        const payload = {

            check:  true

          };

        //   var token = jwtr.sign(payload, app.get('Secret'), {
        //         expiresIn: 1440 // expires in 24 hours

        //   });
           jwtr.sign(payload, app.get('Secret'))
          .then((token)=>{
                  // your code
                  res.json({
                    message: 'authentication done ',
                    token: token
                  });
          })
          .catch((error)=>{
                  // error handling
                  res.json({error: "loi"});
          });


          

        }else{
            res.json({message:"please check your password !"})
        }

    }else{

        res.json({message:"user not found !"})

    }

})
//----Create router for authentication
const  ProtectedRoutes = express.Router(); 

app.use('/api', limiter,ProtectedRoutes);

ProtectedRoutes.use((req, res, next) =>{


    // check header for the token
    var token = req.headers['access-token'];
    //jwtr.destroy("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwianRpIjoibEFacFp5bmZwdiIsImlhdCI6MTYwMzk0MDc3OH0.R81Wb4b4D_Fo6IpH-KOl3MvHCtgqekikB-eUNN3EHYE");
    // decode token
    if (token) {

      // verifies secret and checks if the token is expired
    //   jwt.verify(token, app.get('Secret'), (err, decoded) =>{      
    //     if (err) {
    //       return res.json({ message: 'invalid token' });    
    //     } else {
    //       // if everything is good, save to request for use in other routes
    //       req.decoded = decoded;    
    //       next();
    //     }
    //   });
    if(token === "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwianRpIjoiSHRKT1ZmYWtVSyIsImlhdCI6MTYwMzk0MjM0N30.khSlmBO_FF4RPnBISRlZKk5OuUHsoS7Wn6iAjRxGNdM"){
        var userToken=jwtr.verify(token,app.get('Secret'));

        userToken.then(function(result) {
            console.log(result) // "Some User token"
            jwtr.destroy(result.jti);
         });
               return res.json({ message: ' token has been blocked' });   
    }
    else{
           
          next();
    }
    

    } else {

      // if there is no token  

      res.send({ 

          message: 'No token provided.' 
      });

    }
  });

//----------------------

// GET   --- Get All data
app.get('/data', limiter, function (req, res) {
    res.json(data);
});

// Get data By Id
app.get('/data/:id', function (req, res) {
    // params được gửi thuộc kiểu string do đó phải convert params về kiểu integer 
    var dataId = parseInt(req.params.id, 10);
    var matcheddata;
    //duyệt từng  phần tử trong data
    data.forEach(function (data) {
        if (dataId == data.id) {
            matcheddata = data;
        }
    });
    if (matcheddata) {
        res.json(matcheddata);
    }
    else {
        res.status(404).send('Not found');
    }
});

// POST ---- Create new data
var dataNextId = 13;


ProtectedRoutes.post('/data-create', function (req, res) {
    var body = req.body;
    body.id = dataNextId++;
    data.push(body);
    res.json(data);
});

//DELETE  ---Deleting data By Id 
ProtectedRoutes.delete('/data-delete/:id', function (req, res) {
    var dataId = parseInt(req.params.id);
    //var matcheddata = underscore.findWhere(data, { id: dataId });
    data.forEach(function (data) {
        if (dataId == data.id) {
            matcheddata = data;
        }
    });

    if (!matcheddata) {
        res.status(404).json({ "error": "no data found with that id" });
    } else {
        data = _.without(data, matcheddata);
        res.json(data);
    }
});

// PUT   ---update data by Id
ProtectedRoutes.put('/data-put/:id', function (req, res) {
    var body = _.pick(req.body, 'name', 'latitude', 'longitude', 'images', 'snippet');//lấy  thuộc tính từ object body
    var validAttributes = {}
    var matcheddata;
    var dataId = parseInt(req.params.id, 10);
    data.forEach(function (data) {
        if (dataId == data.id) {
            matcheddata = data;
        }
    });
    //var matchedTodo = _.findWhere(data, {id: dataId});

    if (!matcheddata) {
        return res.status(404).json();
    }

    
    if (body.hasOwnProperty('name') && _.isString(body.name) &&
        body.name.trim().length > 0) {
        validAttributes.name = body.name;
    } else if (body.hasOwnProperty('name')) {
        return res.status(404).json();
    }

    if (body.hasOwnProperty('latitude') && _.isNumber(body.latitude)) {
        validAttributes.latitude = body.latitude;
    } else if (body.hasOwnProperty('latitude')) {
        return res.status(404).json();
    }

    if (body.hasOwnProperty('longitude') && _.isNumber(body.longitude)) {
        validAttributes.longitude = body.longitude;
    } else if (body.hasOwnProperty('longitude')) {
        return res.status(404).json();
    }
    if (body.hasOwnProperty('images') && _.isString(body.images) &&
        body.images.trim().length > 0) {
        validAttributes.images = body.images;
    } else if (body.hasOwnProperty('images')) {
        return res.status(404).json();
    }
    if (body.hasOwnProperty('snippet') && _.isString(body.snippet) &&
        body.snippet.trim().length > 0) {
        validAttributes.snippet = body.snippet;
    } else if (body.hasOwnProperty('snippet')) {
        return res.status(404).json();
    }

    _.extend(matcheddata, validAttributes);
    res.json(matcheddata);

});

//jwt.destroy('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNjAzOTM5NjM0LCJleHAiOjE2MDM5NDEwNzR9.A6WDBaF5v7ahhShd3NabxmzDDJEw3a_xLqYn4S_y0kI')
