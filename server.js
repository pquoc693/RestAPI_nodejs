// import thư viện express
var data = require('./data');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require("underscore");
var app = express();
// khai báo cổng chạy dịch vụ
var PORT = process.env.PORT || 3000;

// "To do API Root" sẽ được trả về khi thực hiện get request trên trang home page của ứng dụng
app.get('/', function (req, res) {
    res.send(data);
});
app.listen(PORT, function () {
    console.log('Express listening on port' + PORT + '!');
});

//
// GET   --- Get All data
app.get('/data', function (req, res) {
    res.json(data);
});

// Get datas By Id
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
        res.status(404).send();
    }
});

// POST ---- Create new datas 
var dataNextId = 13;
app.use(bodyParser.json());

app.post('/data', function (req, res) {
    var body = req.body;
    body.id = dataNextId++;
    data.push(body);
    res.json(data);
});

//DELETE  ---Deleting datas By Id 
app.delete('/data/:id', function (req, res) {
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

//PUT  ---update data By Id
// app.put('/data/:id', function (req, res) {
//     var body = _.pick(req.body, 'name', 'latitude', 'longitude', 'images', 'snippet');//lấy  thuộc tính từ object body
//     var validAttribute = {};

//     var dataId = parseInt(req.params.id,10);
//     //var matcheddata = underscore.findWhere(data, { id: dataId })
//     data.forEach(function (data) {
//         if (dataId == data.id) {
//             matcheddata = data;
//         }
//     });
//     if (!matcheddata) {
//         res.status(404).json();
//     }
//     if (body.hasOwnProperty('name') ) {
//         validAttribute.name = body.name;
//     }
    
//     if (body.hasOwnProperty('latitude')) {
//         validAttribute.latitude = body.latitude;
//     }
//     if (body.hasOwnProperty('longitude') ) {
//         validAttribute.longitude = body.longitude;
//     }
//     if (body.hasOwnProperty('images') ) {
//         validAttribute.images = body.images;
//     }
//     if (body.hasOwnProperty('snippet')) {
//         validAttribute.snippet = body.snippet;
//     }
//     _.extend(matcheddata, validAttributes);
//     res.json(matcheddata);
// });


// // PUT /todos/:id
// app.put('/todos/:id', function(req, res) {
    // var body = _.pick(req.body, 'description', 'completed');
    // var validAttributes = {}
  
    // var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});
  
    // if (!matchedTodo) {
    //   return res.status(404).json();
    // }
  
    // if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    //   validAttributes.completed = body.completed;
    // } else if (body.hasOwnProperty('completed')){
    //   return res.status(404).json();
    // }
  
    // if (body.hasOwnProperty('description') && _.isString(body.description) &&
    //   body.description.trim().length > 0) {
    //   validAttributes.description = body.description;
    // } else if (body.hasOwnProperty('description')) {
    //   return res.status(404).json();
    // }
  
    // _.extend(matchedTodo, validAttributes);
    // res.json(matchedTodo);
  
//   });