var express = require('express');
var router = express.Router();
var config = require('../../auth/config.json');
var mysql = require('mysql');
var connectionPool = mysql.createPool(config);
var async = require('async');

router.get('/:idx', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var queryString = 'select iderror, rank, numofinstances, errorname, errorclassname, linenum, status, ' +
            'DATE_FORMAT(CONVERT_TZ(createdate, \'UTC\', ?), \'%Y-%m-%d %T\') as createdate, DATE_FORMAT(CONVERT_TZ(lastdate, \'UTC\', ?), \'%Y-%m-%d %T\') as lastdate, wifion, mobileon, gpson, totalmemusage ' +
            'from errors ' +
            'where iderror = ?';
        var error_id = req.params.idx;

        connectionPool.getConnection(function(err, connection) {
            connection.query(queryString, [req.session.timezone, req.session.timezone, error_id], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }
                else if (rows.length === 0) {
                    res.status(204);
                    res.json({});
                    connection.release();
                } else {
                    var result = rows[0];
                    result.createdate = rows[0].createdate;
                    result.lastdate = rows[0].lastdate;
                    res.status(200);
                    res.json(result);
                    connection.release();
                }
            });
        });
    }else{
        res.status(401);
        res.json({});
    }
});

router.get('/:idx/callstack', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var queryString = 'select callstack from errors where iderror = ?';
        var error_id = req.params.idx;

        connectionPool.getConnection(function(err, connection) {
            connection.query(queryString, [error_id], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }else{
                    res.status(200);
                    var data = {};
                    if (rows.length === 0) {
                        data['length'] = 0;
                        res.json(data);
                        connection.release();
                    } else {
                        var rawArr = rows[0].callstack.replace(/\n\t/g,'\n    ').split('\n');
                        var count = 0;
                        for(var i in rawArr){
                            data[i] = rawArr[i];
                            count++;
                        }
                        data['length'] = count;
                        res.json(data);
                        connection.release();
                    }
                }
            });
        });
    }else{
        res.status(401);
        res.json({});
    }
});

router.get('/:idx/daily', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var error_id = req.params.idx;
        var period = 6;
        var queryString = 'select date(a.datetime) as datetime, if(i.error_count is null, a.error_count, i.error_count) as error_count ' +
            'from (select date(datetime) as datetime, count(*) error_count ' +
            'from instances where iderror = ? and datetime >= date(now()) - interval ? day ' +
            'group by date(datetime) order by datetime) as i right join (select date(datetime) as datetime, 0 as error_count ' +
            'from temp_date where datetime >= date(now()) - interval ? day and datetime < date(now()) + interval 1 day ' +
            'group by date(datetime) order by datetime) as a on date(i.datetime) = date(a.datetime)';

        connectionPool.getConnection(function(err, connection) {
            connection.query(queryString, [error_id, period, period], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }else{
                    var result = {
                         data: []
                    };
                    for (var i = 0; i < rows.length; i++) {
                        var element = [];
                        var datetime = rows[i].datetime;
                        element.push(datetime.getTime());
                        element.push(rows[i].error_count);
                        result.data.push(element);
                    }
                    result.timezone = req.session.timezone;
                    res.status(200);
                    res.json(result);
                    connection.release();
                }
            });
        });
    }else{
        res.status(401);
        res.json([]);
    }
});

router.get('/:idx/instances', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var error_id = req.params.idx;
        var period = 6;
        var queryString = 'select idinstance, sdkversion, locale, DATE_FORMAT(CONVERT_TZ(datetime, \'UTC\', ?), \'%Y-%m-%d %T\') as datetime, ' +
            'device, country, appversion, osversion, gpson, wifion, mobileon, scrwidth, scrheight, batterylevel, availsdcard, ' +
            'rooted, appmemtotal, appmemfree, appmemmax, kernelversion, xdpi, ydpi, scrorientation, sysmemlow, ' +
            'if(lastactivity = \'\', \'unknown\', lastactivity) as lastactivity, null as carrier_name ' +
            'from instances ' +
            'where iderror = ? and datetime >= date(now()) - interval ? day order by datetime desc limit 20';

        connectionPool.getConnection(function(err, connection) {
            connection.query(queryString, [req.session.timezone, error_id, period], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }
                if (rows.length === 0) {
                    res.status(204);
                    res.json({});
                    connection.release();
                } else {
                    res.status(200);
                    res.json(rows);
                    connection.release();
                }
            });
        });
    }else{
        res.status(401);
        res.json({});
    }
});

router.get('/:idx/statistics', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var error_id = req.params.idx;
        var period = 6;
        connectionPool.getConnection(function(err, connection) {
            async.waterfall([
                function(callback) {
                    var result = {};
                    var queryString = 'select count(*) as weekly_instancecount from instances where iderror = ? and datetime >= date(now()) - interval ? day';
                    connection.query(queryString, [error_id, period], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.json({});
                            connection.release();
                        }else{
                            result.total_error_count = rows[0].weekly_instancecount;
                            callback(null, result);
                        }
                    });
                },
                function(result, callback) {
                    var queryString = 'select appversion, count(*) as count from instances where iderror = ? and datetime >= date(now()) - interval ? day group by appversion order by count(*) desc';
                    connection.query(queryString, [error_id, period], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.json({});
                            connection.release();
                        }else{
                            result.appversion_counts = rows;
                            callback(null, result);
                        }
                    });
                },
                function(result, callback) {
                    var queryString = 'select device, count(*) as count ' +
                        'from instances ' +
                        'where iderror = ? and datetime >= date(now()) - interval ? day ' +
                        'group by device ' +
                        'order by count(*) desc';
                    connection.query(queryString, [error_id, period], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.json({});
                            connection.release();
                        }else{
                            result.device_counts = rows;
                            callback(null, result);
                        }
                    });
                },
                function(result, callback) {
                    var queryString = 'select osversion, count(*) as count ' +
                        'from instances ' +
                        'where iderror = ? and datetime >= date(now()) - interval ? day ' +
                        'group by osversion ' +
                        'order by count(*) desc';
                    connection.query(queryString, [error_id, period], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.json({});
                            connection.release();
                        }else{
                            result.sdkversion_counts = rows;
                            callback(null, result);
                        }
                    });
                },
                function(result, callback) {
                    var queryString = 'select country, count(*) as count ' +
                        'from instances ' +
                        'where iderror = ? and datetime >= date(now()) - interval ? day ' +
                        'group by country ' +
                        'order by count(*) desc';
                    connection.query(queryString, [error_id, period], function(err, rows, fields) {
                        if (err) {
                            res.status(500);
                            res.json({});
                            connection.release();
                        }else{
                            result.country_counts = rows;
                            callback(null, result);
                        }
                    });
                }
            ], function(err, result) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }else{
                    var data = result;
                    var total = data.total_error_count;

                    for(var i in data.appversion_counts){
                        data.appversion_counts[i].count = (data.appversion_counts[i].count / total * 100).toFixed(2);
                    }

                    for(var i in data.device_counts){
                        data.device_counts[i].count = (data.device_counts[i].count / total * 100).toFixed(2);
                    }

                    for(var i in data.sdkversion_counts){
                        data.sdkversion_counts[i].count = (data.sdkversion_counts[i].count / total * 100).toFixed(2);
                    }

                    for(var i in data.country_counts){
                        data.country_counts[i].count = (data.country_counts[i].count / total * 100).toFixed(2);
                    }

                    res.status(200);
                    res.json(data);
                    connection.release();
                }
            });
        });
    }else{
        res.status(401);
        res.json({});
    }
});

router.get('/:idx/eventpath', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if(req.user){
        var queryString = 'select *, count(*) as count from eventpaths where iderror = ? group by classname, methodname, label order by idinstance, depth';
        var error_id = req.params.idx;
        connectionPool.getConnection(function(err, connection) {
            connection.query(queryString, [error_id], function(err, rows, fields) {
                if (err) {
                    res.status(500);
                    res.json({});
                    connection.release();
                }
                else if (rows.length === 0) {
                    res.status(204);
                    res.json({});
                    connection.release();
                } else {
                    var data = [];
                    var start = '';
                    var end = '';

                    for (var i = 0; i < rows.length; i++) {
                        var arr = [];
                        if (i > 0 && (rows[i].idinstance !== rows[i - 1].idinstance)) {
                            if (rows[i].label.length !== 0) {
                                start = rows[i].label + ': ' + rows[i].linenum;
                            } else {
                                start = rows[i].methodname + ': ' + rows[i].linenum;
                            }
                            continue;
                        }
                        if (i != 0) {
                            if (rows[i].label.length !== 0) {
                                end = rows[i].label + ': ' + rows[i].linenum;
                            } else {
                                end = rows[i].methodname + ': ' + rows[i].linenum;
                            }

                            arr.push(start);
                            arr.push(end);
                            arr.push(1);
                            data.push(arr);
                        }
                        console.log(data);
                        if (rows[i].label.length !== 0) {
                            start = rows[i].label + ': ' + rows[i].linenum;
                        } else {
                            start = rows[i].methodname + ': ' + rows[i].linenum;
                        }
                    }
                    res.status(200);
                    res.json(data);
                    connection.release();
                }
            });
        });
    }else{
        res.status(401);
        res.json({});
    }
});

module.exports = router;