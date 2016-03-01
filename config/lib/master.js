var WebSocketServer = require('ws').Server;
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var fs = require('fs-extra');
var db;
var uuid = require('node-uuid');

var urlLib = require('url');
var mongoDB = require('./crawlerdb');


function Worker(connection){
    console.log('Worker....1 ');
    this.connection = connection;
    this.ready = true;
    this.uuid = uuid.v4();
    this.connection.send(JSON.stringify({type: 'info', data: {message: 'master connected'}}));
}

Worker.prototype.assignUrls = function(urls){
    console.log('assignUrls....2 ' + JSON.stringify({type: 'crawl', data: {urls: urls}}));
    this.connection.send(JSON.stringify({type: 'crawl', data: {urls: urls}}));
};

function Master(options){
    console.log('Master....3 ');
    this.init(options);
    this.workers = [];
};

Master.prototype.getWorkerByConnection = function(connection){
    console.log('getWorkerByConnection....4 ');
    var self = this;
    var tempWorker = null;
    self.workers.forEach(function(worker){
        if(worker.connection === connection){
            tempWorker = worker;
        }
    });
    return tempWorker;
};

Master.prototype.init = function(options){
    console.log('init....5');
    var allowedDomain = urlLib.parse(options.url).hostname;

    fs.copySync('./schema/schema.sqlite3', allowedDomain + '.sqlite3');
    db = new sqlite3.Database(allowedDomain + '.sqlite3');

    //resend state to workers on system restart
    //db.run('update queue set queued = 0 where crawled = 0', [], function(){});

    mongoDB.resetQueue();


    var self = this;
    var wss = new WebSocketServer(options);

    wss.on('listening', function(){
        console.log('listening....6');
        console.log('master listening on ' + options.port);
    });

    wss.on('connection', function connection(ws) {
        console.log('connection....7');
        var worker = new Worker(ws);

        ws.on('message', function incoming(message) {
            message = JSON.parse(message);
            var type = message.type;
            var data = message.data;
            console.log('message....8' + JSON.stringify(message));

            switch(type){
                case 'urls': {
                    //console.log('message....9');
                    data.urls.forEach(function(url){
                        if (url.indexOf(allowedDomain) > -1) {
                            if (
                                url.indexOf('.jpg') === -1
                                && url.indexOf('.png') === -1
                                && url.indexOf('#') === -1
                                && url.indexOf('javascript:') === -1
                            ) {

                                /*db.get('select count(1) as results_count from queue where url = ?', url, function(err, row){
                                    if (!parseInt(row.results_count)) {
                                        db.run('insert into queue (url) values(?)', url, function(err){
                                            if (!err) {
                                                //console.log(url + ' added to queue');
                                            }
                                        });
                                    }
                                }); */

                                mongoDB.updateUrlToQueue(url);
                            }
                        }
                    });
                }
                    break;

                case 'html': {
                    console.log('message....10');
                    var html = data.html;
                    var url = data.url;

                   /* db.run('update queue set crawled = 1 where url = ?', [url.trim()], function(){
                        db.run('insert into pages (url, html) values(?,?)', [url, html], function(err){
                            //console.log('received html for page: ' + url + ', length ' + html.length );
                        });
                    }); */
                    // mongodb
                    mongoDB.updateHtmlToPageAndQueue(url, html);

                }
                    break;

                case 'ready': {
                    console.log('message....11');
                    var tempWorker = self.getWorkerByConnection(ws);
                    if (tempWorker) {
                        tempWorker.ready = true;
                        //console.log('worker ready');
                    }
                }
            }

        });

        ws.on('close', function(){
            console.log('close....12');
            var tempWorker = self.getWorkerByConnection(ws);

            db.run('update queue set queued = 0 where crawled = 0 and worker_uuid = ?', [tempWorker.uuid], function(){
                console.log('reset queue state for items queued to ' + tempWorker.uuid);
            });

            mongoDB.closeQueue(tempWorker.uuid);

            self.workers.splice(self.workers.indexOf(tempWorker), 1);
            console.log('worker disconnected, current workers: ' + self.workers.length);
        });

        // first send here, if not
        if (options.url) {
            console.log('options.url....13');
            ws.send(JSON.stringify({type: 'crawl', data: {urls: [options.url]}}));
        } else {
            console.log('root url not set');
        }

        self.workers.push(worker);
        console.log('worker connected, current workers: ' + self.workers.length);
    });

    setInterval(function(){
        console.log('setInterval....14'+ self.workers.length);

        mongoDB.getQueuePaging([self.workers.length * 5], function(rows){
            self.workers.forEach(function(worker, workerIndex){
                if (worker.ready) {
                    var urlsToProcess = [];
                    rows.forEach(function(row, rowIndex){
                        if (rowIndex % self.workers.length === workerIndex) {
                            urlsToProcess.push(row.url);
                            mongoDB.updateQueue(row.url, worker.uuid);
                           // db.run('update queue set queued = 1, worker_uuid = ? where url = ?', [worker.uuid, row.url.trim()]);

                        }
                    });
                    console.log(urlsToProcess.length + ' links passed to worker');
                    worker.assignUrls(urlsToProcess);
                    worker.ready = false;
                }
            });
        });



       /* db.all('select * from queue where queued = 0 limit 0, ?', [self.workers.length * 5], function(err, rows){
            console.log('setInterval....15'+ JSON.stringify(rows));
            self.workers.forEach(function(worker, workerIndex){
                if (worker.ready) {
                    var urlsToProcess = [];
                    rows.forEach(function(row, rowIndex){
                        if (rowIndex % self.workers.length === workerIndex) {
                            urlsToProcess.push(row.url);
                            db.run('update queue set queued = 1, worker_uuid = ? where url = ?', [worker.uuid, row.url.trim()]);
                        }
                    });
                    console.log(urlsToProcess.length + ' links passed to worker');
                    worker.assignUrls(urlsToProcess);
                    worker.ready = false;
                }
            });
        }); */
       /*
        db.get('select count(1) as number from queue', {}, function(err, row){
            var inTotal = row.number;
            console.log('setInterval....16'+ JSON.stringify(row));
            db.get('select count(1) as number from queue where queued = 1', {}, function(err, row){
                var queuedForCrawl = row.number;
                db.get('select count(1) as number from queue where crawled = 1', {}, function(err, row){
                    var crawledTotal = row.number;
                    console.log(inTotal + ' unique links discovered, ' + queuedForCrawl + ' links sent for crawl, ' + crawledTotal + ' links crawled, active workers: ' + self.workers.length);
                });
            });
        }); */


    }, 1000 * 5);
};

module.exports = Master;
