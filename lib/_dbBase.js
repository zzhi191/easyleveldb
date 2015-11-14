var level = require('level');
var promisify = require('q-level');
var Q = require('q');
var config = require('../config/db_config.json');
var dbpath = config.db_path;
var _db = promisify(level(dbpath));
var tool = require('../utils/tools');
var _ = require('lodash');


function _dbBase(tableName) {
    //构造函数
    this.db = _db;
    this.tableName = tableName;
}

_dbBase.prototype.base_put = function (key, value) {
    var self = this;
    var defer = Q.defer();
    if (key && value) {
        return self.db.put(key, value).then(function () {
            return tool.autoReturn(null, 'success');
        }, function (error) {
            return tool.autoReturn(error);
        }).catch(function (error) {
            return tool.autoReturn(error);
        });
    } else {
        defer.reject(tool.autoReturn('no key or value'));
        return defer.promise;
    }
}

_dbBase.prototype.base_get = function (key) {
    var self = this;
    var defer = Q.defer();
    if (key) {
        return self.db.get(key).then(function (value) {
            return tool.autoReturn(null, value);
        }, function (error) {
            return tool.autoReturn(error);
        }).catch(function (error) {
            return tool.autoReturn(error);
        });
    } else {
        defer.reject(tool.autoReturn('has no key'));
    }
    return defer.promise;
}


_dbBase.prototype.base_delete = function (key) {
    var self = this;
    var defer = Q.defer();
    if (key) {
        return self.db.del(key).then(function (result) {
            return tool.autoReturn(null, result);
        }).catch(function (error) {
            return tool.autoReturn(error);
        });
    } else {
        defer.reject(tool.autoReturn('have on key'));
    }
    return defer.promise;
}


_dbBase.prototype.base_find = function (find) {
    var self = this;
    var result = [];
    var defer = Q.defer();
    var option = {
        keys: true,
        values: true,
        revers: false,
        limit: 20,
        fillCache: true
    };


    if (!find) {
        defer.reject('have on key');
    } else {
        if (find.prefix) {
            option.start = find.prefix;
            option.end = find.prefix.substring(0, find.prefix.length - 1) + String.fromCharCode(find.prefix[find.prefix.length - 1].charCodeAt() + 1);
        }
        if (find.limit)
            option.limit = find.limit;

        self.db.createReadStream(option).progress(function (data) {
            var kv = {};
            kv[data.key] = data.value;
            result.push(kv);
        }, function (err) {
            defer.reject(tool.autoReturn(err));
        }).catch(function (error) {
            defer.reject(tool.autoReturn('function base_load_all catch error'));
        }).done(function () {
            defer.resolve(tool.autoReturn(null, result));
        });
    }
    return defer.promise;
}


_dbBase.prototype.base_load_all = function () {
    var self = this;
    var result = [];
    var defer = Q.defer();

    self.db.createReadStream().progress(function (data) {
        var kv = {};
        kv[data.key] = data.value;
        result.push(kv);
    }, function (err) {
        console.log('**error***', err);
    }).catch(function (error) {
        defer.reject(tool.autoReturn(error));
    }).done(function () {
        defer.resolve(tool.autoReturn(null, result));
    });
    return defer.promise;
}


_dbBase.prototype.insert = function (obj) {
    var self = this;
    return self.option('insert', obj);
}

_dbBase.prototype.update = function (obj) {
    var self = this;
    return self.option('update', obj);
}

_dbBase.prototype.delete = function (obj) {
    var self = this;
    return self.option('delete', obj);
}

_dbBase.prototype.option = function (flag, obj) {
    var self = this;
    var tableName = self.tableName;
    var objStr = '';
    var batchObj = [];
    var deferred = Q.defer();
    if (!obj || !tableName) {
        deferred.reject(tool.autoReturn('tableName or obj is empty!'));
    }

    if (typeof obj != 'object') {
        deferred.reject(tool.autoReturn('parame is not object!'))
    }

    if (!config || !config.table[tableName]) {
        deferred.reject(tool.autoReturn(tableName + 'is not defined in db_config.json'));
    }

    if (!config.table[tableName]._id) {
        deferred.reject(tool.autoReturn('not defined identity ID'));
    }


    var identityID, mainKey;
    if (flag == 'insert') {
        if (obj.hasOwnProperty(config.table[tableName]._id)) {
            identityID = obj._id;
        } else {
            identityID = tool.generateUUID();
        }
        obj._id = identityID;
        mainKey = 'table' + '.' + tableName + '.' + identityID;
    } else if (flag == 'update' || flag == 'delete') {
        if (obj.hasOwnProperty(config.table[tableName]._id)) {
            identityID = obj._id;
        } else {
            deferred.reject(tool.autoReturn('update info have no identityID'));
        }
        mainKey = 'table' + '.' + tableName + '.' + identityID;
    }

    if (flag == 'delete') {
        //删除
        batchObj.push({type: "del", key: mainKey});
        config.table[tableName].field.forEach(function (item) {
            if (item.name && item.index && obj[item.name]) {
                var opt = {};
                opt.type = 'del';
                opt.key = '.' + tableName + '.' + item.name + ':' + obj[item.name] + '.' + identityID;
                batchObj.push(opt);
            }
        });
        if (batchObj && batchObj.length > 0) {
            return self.db.batch(batchObj);
        }
    } else {
        //更新
        if (flag == 'update') {
            self.base_get(mainKey).then(function (result) {
                var updateInfo;
                if (result && result.data) {
                    updateInfo = tool.parseJSON(result.data);
                }
                return updateInfo;
            }).then(function (updateBefor) {
                //删除旧数据
                config.table[tableName].field.forEach(function (item) {
                    if (item.name && item.index && updateBefor[item.name]) {
                        var opt = {};
                        opt.type = 'del';
                        opt.key = '.' + tableName + '.' + item.name + ':' + updateBefor[item.name] + '.' + identityID;
                        batchObj.push(opt);
                    }
                });
                if (batchObj && batchObj.length > 0) {
                    self.db.batch(batchObj);
                }
            });
        }

        //添加新数据
        //序列化
        objStr = JSON.stringify(obj);
        batchObj.push({type: "put", key: mainKey, value: objStr});
        config.table[tableName].field.forEach(function (item) {
            if (item.name && item.index && obj[item.name]) {
                var opt = {};
                opt.type = 'put';
                opt.key = '.' + tableName + '.' + item.name + ':' + obj[item.name] + '.' + identityID;
                opt.value = identityID;
                batchObj.push(opt);
            }
        });
        if (batchObj && batchObj.length > 0) {
            return self.db.batch(batchObj);
        }
    }
    return deferred.promise;
}


_dbBase.prototype.selectInfoByID = function (identity) {
    var self = this;
    var tableName = self.tableName;
    var deferred = Q.defer();
    if (!identity || !tableName) {
        deferred.reject(tool.autoReturn('tableName or identity is empty!'));
    }

    if (!config || !config.table[tableName]) {
        deferred.reject(tool.autoReturn(tableName + 'is not defined in db_config.json'));
    }

    if (!config.table[tableName]._id) {
        deferred.reject(tool.autoReturn('not defined identity ID'));
    }

    var getInfoKey = 'table' + '.' + tableName + '.' + identity;
    return self.getInfoByKey(getInfoKey).then(function (result) {
        return result;
    }, function (error) {
        return error;
    });
    return deferred.promise;
}

_dbBase.prototype.selectInfoByKV = function (filedObj) {
    var self = this;
    var tableName = self.tableName;
    var rtn = {};
    var deferred = Q.defer();
    if (!tableName) {
        deferred.reject(tool.autoReturn('tableName is empty!'));
    }
    if (typeof filedObj != 'object') {
        deferred.reject(tool.autoReturn('parame is not object!'));
    }

    if (Object.keys(filedObj).length <= 0) {
        deferred.reject(tool.autoReturn('parame is empty'));
    }

    if (!config || !config.table[tableName]) {
        deferred.reject(tool.autoReturn(tableName + 'is not defined in db_config.json'));
    }

    var indexKeys = [];
    for (var i = 0; i < Object.keys(filedObj).length; i++) {
        if (filedObj[Object.keys(filedObj)[i]]) {
            var indexKey = '.' + tableName + '.' + Object.keys(filedObj)[i] + ':' + filedObj[Object.keys(filedObj)[i]];
            indexKeys.push(indexKey);
        }
    }

    if (indexKeys.length > 0) {
        return self.getInfoByIdx(indexKeys).then(function (result) {
            return result;
        });
    } else {
        deferred.reject(tool.autoReturn('parame is wrong'));
    }
    return deferred.promise;
}


_dbBase.prototype.selectListByKV = function (filedObj, limit) {
    var self = this;
    var tableName = self.tableName;
    var rtn = {};
    var deferred = Q.defer();
    if (!tableName) {
        deferred.reject(tool.autoReturn('tableName is empty!'));
    }
    if (typeof filedObj != 'object') {
        deferred.reject(tool.autoReturn('parame is not object!'));
    }

    if (Object.keys(filedObj).length <= 0) {
        deferred.reject(tool.autoReturn('parame is empty'));
    }

    if (!filedObj[Object.keys(filedObj)[0]]) {
        deferred.reject(tool.autoReturn('parame object value is empty'));
    }

    if (!config || !config.table[tableName]) {
        deferred.reject(tool.autoReturn(tableName + 'is not defined in db_config.json'));
    }

    var indexKey = '.' + tableName + '.' + Object.keys(filedObj)[0] + ':' + filedObj[Object.keys(filedObj)[0]];
    return self.getListByIdx(indexKey, limit).then(function (result) {
        return result;
    });

    return deferred.promise;
}

_dbBase.prototype.getInfoByIdx = function (idxs) {
    var self = this;
    var defer = Q.defer();
    if (!idxs) {
        defer.reject(tool.autoReturn('parame have no index'));
    }

    if (!Array.isArray(idxs)) {
        defer.reject(tool.autoReturn('parame format is wrong'));
    }

    var tabName = this.tableName;
    var num = idxs.length;
    var rtnInfo = [];

    idxs.forEach(function (idx) {
        self.base_find({
            prefix: idx,
            limit: -1
        }).then(function (result) {
            return result && result.data && result.data;
        }, function (resErr) {
            defer.reject(resErr);
        }).then(function (uuids) {
            if (!uuids) {
                defer.reject(tool.autoReturn('not find identityID'));
            } else {
                if (uuids && Array.isArray(uuids)) {
                    var infokey;
                    uuids.forEach(function (kv) {
                        var uuid = _.values(kv)[0];
                        infokey = 'table.' + tabName + '.' + uuid;
                    });
                    if (infokey) {
                        return self.base_get(infokey).then(function (result) {
                            if (result.code == 0 && result.data) {
                                rtnInfo.push(result.data);
                            }
                        });
                    }
                } else {
                    defer.reject(tool.autoReturn('not find info '));
                }
            }
            if (--num == 0) {
                defer.resolve(tool.autoReturn(null, rtnInfo))
            }
        })
    });
    return defer.promise;
}

_dbBase.prototype.getListByIdx = function (idx, limit) {
    var self = this;
    var deferred = Q.defer();
    var tabName = self.tableName;
    var prefix = {
        prefix: idx,
        limit: limit || -1
    };
    var list = [],
        num;
    self.base_find(prefix).then(function (result) {
        if (result && result.data && result.data.length > 0) {
            var IDS=[];
            result.data.forEach(function (item) {
                var _var= _.values(item);
                IDS.push(_var[0]);
            });
            return IDS;
        }else{
            deferred.resolve(null,tool.autoReturn(list));
        }
    }).then(function(UUIDS){
        if (UUIDS.length > 0) {
            num = UUIDS.length;
            UUIDS.forEach(function (item) {
                var searckey ='table.'+ tabName + '.' + item;
                return self.getInfoByKey(searckey).then(function (result) {
                    if (result.code == 0) {
                        list.push(result.data);
                    }
                    if (--num == 0) {
                        deferred.resolve(tool.autoReturn(null, list));
                    }
                });
            })
        }else{
            deferred.resolve(tool.autoReturn(null,list));
        }
    });
    return deferred.promise;
}

_dbBase.prototype.getInfoByKey = function (key) {
    var self = this;
    var deferred = Q.defer();
    if (!key) {
        deferred.reject(tool.autoReturn('no key'));
    } else {
        self.base_get(key).then(function (value) {
            if (value && value.data) {
                deferred.resolve(tool.autoReturn(null, tool.parseJSON(value.data)));
            } else {
                deferred.reject(tool.autoReturn('get info error'));
            }
        })
    }
    return deferred.promise;
}

_dbBase.prototype.deletByKey = function (key) {
    var self = this;
    var deferred = Q.defer();
    if (!key) {
        deferred.reject(tool.autoReturn('no key'));

    } else {
        return self.base_delete(key).then(function (result) {
            return result;
        });
    }
    return deferred.promise;
}

module.exports = _dbBase;


