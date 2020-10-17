// import thư viện 
var data = require('./data');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require("underscore");
var app = express();
// khai báo cổng chạy dịch vụ
var PORT = process.env.PORT || 3000;

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
        res.status(404).send();
    }
});

// POST ---- Create new data
var dataNextId = 13;
app.use(bodyParser.json());

app.post('/data', function (req, res) {
    var body = req.body;
    body.id = dataNextId++;
    data.push(body);
    res.json(data);
});

//DELETE  ---Deleting data By Id 
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

// PUT   ---update data by Id
app.put('/data/:id', function (req, res) {
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