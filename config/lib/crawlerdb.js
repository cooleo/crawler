var mongoose = require('mongoose');
var Queue = mongoose.model('Queue');
var Page = mongoose.model('Page');
var _ = require('lodash');

var crawlerDB = {
    updateUrlToQueue: function (url) {
        Queue.find({"url": url}).exec(function (err, queues) {
            if (err) {
            } else {
                if (queues == null || queues.length == 0) {
                    console.log('queue:' + JSON.stringify(queues));
                    var queue = new Queue({"queued": 0, "crawled": 0, "url": url});
                    queue.save(function (err) {
                        if (err) {
                            //console.log('error:' + JSON.stringify(err));
                        } else {
                            console.log(url + ' ..........added to queue');
                        }
                    });
                }
            }
        });
    },
    resetQueue: function () {
        Queue.find({"crawled": 0}).exec(function (err, queues) {
            if (err) {
            } else {
                if (queues != null || queues.length() > 0) {
                    _.forEach(queues, function (queue) {
                        queue.queued = 0;
                        queue.save(function (err) {
                            if (err) {
                                //console.log('error:' + JSON.stringify(err));
                            } else {
                                console.log('reset queue fininsh...');
                            }
                        });
                    });

                }
            }
        });
    },
    updateHtmlToPageAndQueue: function (url, html) {
        Queue.find({"url": url.trim()}).exec(function (err, queues) {
            if (err) {
            } else {
                if (queues != null && queues.lenth>0) {
                    var queue = queues[0];
                    queue.crawled = 1;
                    console.log('queue' + JSON.stringify(queue));
                    queue.save(function (err) {
                        if (err) {
                            console.log('error:' + JSON.stringify(err));
                        } else {
                            console.log('save queue:' + JSON.stringify(queue));
                            // update page
                            var page = new Page({"url": url, "html": html});
                            page.save(function (err) {
                                if (err) {
                                    console.log('error:' + JSON.stringify(err));
                                } else {
                                    console.log('save page:' + JSON.stringify(page));
                                }
                            });
                            //
                        }
                    });
                }
            }
        });
    },
    closeQueue: function (worker_uuid) {
        Queue.find({"crawled": 0, "worker_uuid": worker_uuid}).exec(function (err, queue) {
            if (err) {
            } else {
                if (queue != null) {
                    queue.queued = 0;
                    queue.save(function (err) {
                        if (err) {
                            console.log('error:' + JSON.stringify(err));
                        } else {
                            console.log('reset queue state for items queued to ' + worker_uuid);
                        }
                    });
                }
            }
        });
    },
    getQueuePaging: function(limit, callback){
        Queue.find({"crawled": 0}).limit(limit).exec(function (err, queues) {
            if (err) {
            } else {
                if (queues != null) {
                    callback(queues);
                }
            }
        });
    },
    updateQueue: function(url, worker_uuid){
        Queue.find({"url": url}).exec(function (err, queues) {
            if (err) {
            } else {
                if (queues != null) {
                    _.forEach(queues, function (queue) {
                        queue.queued = 1;
                        queue.worker_uuid =worker_uuid;
                        queue.save(function (err) {
                            if (err) {
                                //console.log('error:' + JSON.stringify(err));
                            } else {
                                console.log('update queue with worker id:' + worker_uuid);
                            }
                        });
                    });
                }
            }
        });
        //db.run('update queue set queued = 1, worker_uuid = ? where url = ?', [worker.uuid, row.url.trim()]);
    }


};
module.exports = crawlerDB;
