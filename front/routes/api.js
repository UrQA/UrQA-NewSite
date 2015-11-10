var express = require('express');
var request = require('request');
var locale = require('../public/app/locale/en.json')
var router = express.Router();

router.get('/projects/list', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/projects/' + req.user.id, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var data = JSON.parse(body);
                if(data['projects']){
                    var projects = data.projects;
                    for(var i in projects){
                        projects[i].platform_icon = locale.PLATFORM_ICON[projects[i].platform];
                        projects[i].platform = locale.PLATFORM[projects[i].platform];
                        projects[i].stage = locale.STAGE[projects[i].stage];
                    }
                    res.json(projects);
                }else{
                    res.json('[]');
                }
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.post('/project/add', function(req, res, next) {
    if(req.user){
        if(req.body.appname && req.body.platform && req.body.category && req.body.stage){
            var requestData = {};
            requestData['appname'] = req.body.appname;
            requestData['platform'] = Number(req.body.platform);
            requestData['category'] = Number(req.body.category);
            requestData['stage'] = Number(req.body.stage);
            requestData['user_id'] = req.user.id;
            request({
                method: 'POST',
                headers:{'content-type': 'application/json'},
                uri:'https://honeyqa.io:8080/project/add',
                body:JSON.stringify(requestData)
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.status(200);
                    req.user.project[JSON.parse(body).insertId] = true;
                    res.json(body);
                }else{
                    console.log(body);
                    res.status(500);
                    res.json('{}');
                }
            });
        }else{
            res.status(400);
            res.json('{}');
        }
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                res.json(body);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/sdk', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/most/errorbysdkversion', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var data = {"data":JSON.parse(body).osversion};
                res.json(data);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/weekly/error', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/weekly_errorcount', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var data = {"data":JSON.parse(body).weekly_instancecount};
                res.json(data);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/weekly/session', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/weekly_sessioncount', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var data = {"data":JSON.parse(body).weekly_sessioncount};
                res.json(data);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/daily/error', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/weekly_appruncount2', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                res.json(JSON.parse(body).data);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/errors/tranding', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/errors_tranding', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var result = [];
                var errors = JSON.parse(body).errors;
                var size = 0;
                for(var i in errors){
                    var data = {};
                    data["ID"] = errors[i].id;
                    data["0"] = locale.RANK[errors[i].rank];
                    data["1"] = errors[i].numofinstance;
                    data["2"] = errors[i].errorname + '<br>' + errors[i].errorclassname + ':' + errors[i].linenum;
                    var str = "";
                    for(var j in errors[i].tags){
                        if(j!=0){
                            str += ',';
                        }
                        str += errors[i].tags[j].tag;
                    }
                    data["3"] = str;
                    data["4"] = errors[i].update_date;
                    result.push(data);
                    size++;
                }
                res.json({sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:result});
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/errors/latest', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/errors_latest', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var result = [];
                var errors = JSON.parse(body).errors;
                var size = 0;
                for(var i in errors){
                    var data = {};
                    data["ID"] = errors[i].id;
                    data["0"] = locale.RANK[errors[i].rank];
                    data["1"] = errors[i].numofinstance;
                    data["2"] = errors[i].errorname + '<br>' + errors[i].errorclassname + ':' + errors[i].linenum;
                    var str = "";
                    for(var j in errors[i].tags){
                        if(j!=0){
                            str += ',';
                        }
                        str += errors[i].tags[j].tag;
                    }
                    data["3"] = str;
                    data["4"] = errors[i].update_date;
                    result.push(data);
                    size++;
                }
                res.json({sEcho:0, iTotalRecords: 60, iTotalDisplayRecords: size, errorData:result});
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/errors/filter', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/project/'+req.params.id+'/filters', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                res.json(body);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/errors', function(req, res, next) {
    if(req.user){
        // appversion / osversion / country
        var data = {};
        var dataArr = [];
        var raw = '';
        var rawArr;
        if(checkAll(req.query.country)){
        }else{
            raw = req.query.country;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['country'] = dataArr;
        dataArr = [];
        if(checkAll(req.query.appversion)){
        }else{
            raw = req.query.appversion;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['appversion'] = dataArr;
        dataArr = [];
        if(checkAll(req.query.osversion)){
        }else{
            raw = req.query.osversion;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['osversion'] = dataArr;
        data['start'] = req.query.datestart;
        data['end'] = req.query.dateend;
        request({ method: 'POST'
                ,headers:{'content-type': 'application/json'}
                , uri: 'https://honeyqa.io:8080/project/'+req.params.id+'/errors/filtered'
                ,body: JSON.stringify(data)
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.status(200);
                    res.json(body);
                }else{
                    res.status(500);
                    res.json('{}');
                }
            })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/errors/latest', function(req, res, next) {
    if(req.user){
        // appversion / osversion / country
        var data = {};
        var dataArr = [];
        var raw = '';
        var rawArr;
        if(checkAll(req.query.country)){
        }else{
            raw = req.query.country;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['country'] = dataArr;
        dataArr = [];
        if(checkAll(req.query.appversion)){
        }else{
            raw = req.query.appversion;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['appversion'] = dataArr;
        dataArr = [];
        if(checkAll(req.query.osversion)){
        }else{
            raw = req.query.osversion;
            rawArr = raw.split(',');
            for(var i=0;i<rawArr.length-1;i++){
                dataArr.push(rawArr[i]);
            }
        }
        data['osversion'] = dataArr;
        data['start'] = req.query.datestart;
        data['end'] = req.query.dateend;
        request({ method: 'POST'
                ,headers:{'content-type': 'application/json'}
                , uri: 'https://honeyqa.io:8080/project/'+req.params.id+'/errors/filtered/latest'
                ,body: JSON.stringify(data)
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.status(200);
                    res.json(body);
                }else{
                    res.status(500);
                    res.json('{}');
                }
            })
    }else{
        res.status(401);
        res.json('{}');
    }
});

router.get('/project/:id/weekly/rank', function(req, res, next) {
    if(req.user){
        request('https://honeyqa.io:8080/statistics/'+req.params.id+'/rank_rate', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.status(200);
                var ranks = JSON.parse(body);
                for(var i in ranks){
                    ranks[i].rank = locale.RANK[ranks[i].rank];
                }
                res.json(ranks);
            }else{
                res.status(500);
                res.json('{}');
            }
        })
    }else{
        res.status(401);
        res.json('{}');
    }
});

function checkAll(d){
    if(d == '' || d == 'all')
        return true;
    return false;
}

module.exports = router;