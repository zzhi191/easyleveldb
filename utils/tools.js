var crypto = require('crypto');
function generateUUID(length) {
    var id = '',
        length = length || 32;
    while (length--)
        id += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16) : (Math.random() * 16 | 0).toString(16).toUpperCase();
    return id.toLowerCase();
}


function checkdate(a, b) {

    //得到日期值并转化成日期格式，replace(/\-/g, "\/")是根据验证表达式把日期转化成长日期格式，这样

//再进行判断就好判断了
    var sDate = new Date(a.replace(/\-/g, "\/"));
    var eDate = new Date(b.replace(/\-/g, "\/"));
    if (sDate > eDate) {

        return true;
    }
    return false;
}

function RndNum(n) {
    var rnd = "";
    for (var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}

function parseJSON(jsonString) {
    if (!jsonString)
        return {};

    var json;
    try {
        json = JSON.parse(jsonString);
    } catch (err) {
        console.error('parseJSON ERROR: ' + jsonString, err);
        console.log(err.stack)
    }

    return json ? json : {};
}

function encodeURIComponentGBK(str) {
    if (str == null || typeof(str) == 'undefined' || str == '')
        return '';

    var a = str.toString().split('');

    for (var i = 0; i < a.length; i++) {
        var ai = a[i];
        if ((ai >= '0' && ai <= '9') || (ai >= 'A' && ai <= 'Z') || (ai >= 'a' && ai <= 'z') || ai === '.' || ai === '-' || ai === '_') continue;
        var b = iconv.encode(ai, 'gbk');
        var e = ['']; // 注意先放个空字符串，最保证前面有一个%
        for (var j = 0; j < b.length; j++)
            e.push(b.toString('hex', j, j + 1).toUpperCase());
        a[i] = e.join('%');
    }
    return a.join('');
}


function getFilePath(fileID) {
    return '/file/' + fileID;
}


function getNumByChar(str, length) {
    var result = '';
    str = str.toLowerCase();
    for (var i = 0; i < length; i++) {
        if (str[i])
            result += ('000000000' + (str[i].charCodeAt() - 96)).slice(-2);
        else
            result += ('000000000'.slice(-2));
    }
    return result;
}

function getYYMMDD(date) {
    if (!date)
        date = new Date();

    return ('0' + date.getFullYear()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
}

function getYYYYMM(date) {
    if (!date)
        date = new Date();

    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2);
}

function getLastMonthYYYYMM() {
    var dateNow = new Date();
    var dateLastMonthYear = parseInt(dateNow.getFullYear());
    var dateLastMonthMonth = parseInt(dateNow.getMonth());
    if (dateLastMonthMonth == 0) {
        dateLastMonthYear = dateLastMonthYear - 1;
        dateLastMonthMonth = 12;
    }
    var dateLastMonth = dateLastMonthYear.toString();
    if (dateLastMonthMonth < 10) {
        dateLastMonth = dateLastMonth + "0" + dateLastMonthMonth.toString();
    }
    else {
        dateLastMonth = dateLastMonth + dateLastMonthMonth.toString();
    }

    return dateLastMonth;
}

function getYYYYMMDD(date) {
    if (!date)
        date = new Date();

    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
}

function getYYYY(date) {
    if (!date)
        date = new Date();
    return date.getFullYear();
}

function getYYMMDDHH(date) {
    if (!date)
        date = new Date();

    return ('0' + date.getFullYear()).slice(-2) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2);
}

function getYYYYMMDDHH(date) {
    if (!date)
        date = new Date();

    return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('0' + date.getHours()).slice(-2);
}


function formatDate(timestamp) {
    if (!timestamp)
        return '';

    var date = new Date(timestamp);

    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function getFixedInt(int, length) {
    return ('000000000000000' + int).slice(-length);
}

function getFixedRandomInt(length) {
    return ('000000000000000' + Math.random() * Math.pow(10, length)).slice(-length);
}


function getMd5(str) {
    var result = "";
    try {
        if (str && typeof str === "string") {
            var md5_str = crypto.createHash('md5');
            result = md5_str.update(str).digest('hex');
        } else
            result = "";

    } catch (err) {
        return result;
    }

    return result;
}

function getDateRange(startDate, endDate) {
    var startTs = Date.parse(startDate + ' 0:0:0'),
        endTs = Date.parse(endDate + ' 0:0:0'),
        list = [];

    for (var i = startTs; i <= endTs; i += 86400000) {
        list.push(new Date(i));
    }
    return list;
}

function distinct(arr) {
    var obj = {};
    arr.forEach(function (item) {
        obj[item] = 1
    })
    return Object.keys(obj);
}

function dynamicPassword(str, length) {
    if (!length)
        length = 6;
    var code = tool.getMd5(str + 'fguio' + getYYMMDD()).substring(0, length);
    return ('0000000000000000000' + (parseInt(code, 16) + '').substring(0, length)).slice(-length);
}

function generateAuthCode() {
    var num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    var x = '';
    for (var i = 0; i < 6; i++) {
        x += num[Math.floor(Math.random() * 10 + 1)]
    }
    return x.toString();
}

function getYYYY_MM_DD(timestamp) {
    var date;
    if (timestamp)
        date = new Date(timestamp);
    else
        date = new Date();
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
}

function trimRight(s) {
    if (s == null) return "";
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(str.length - 1)) != -1) {
        var i = str.length - 1;
        while (i >= 0 && whitespace.indexOf(str.charAt(i)) != -1) {
            i--;
        }
        str = str.substring(0, i + 1);
    }
    return str;
}

function trimLeft(s) {
    if (s == null) {
        return "";
    }
    var whitespace = new String(" \t\n\r");
    var str = new String(s);
    if (whitespace.indexOf(str.charAt(0)) != -1) {
        var j = 0, i = str.length;
        while (j < i && whitespace.indexOf(str.charAt(j)) != -1) {
            j++;
        }
        str = str.substring(j, i);
    }
    return str;
}

function trim(s) {
    return trimRight(trimLeft(s));
}


//函数功能：json 排序
// filed:(string)排序字段，
// reverse: (bool) 是否倒置(是，为倒序)
// primer (parse)转换类型
//示例:list.sort(tool.sortJSONArry('downloadTimes',true,parseInt));
var sortJSONArry = function (filed, reverse, primer) {
    reverse = (reverse) ? -1 : 1;

    return function (a, b) {
        a = a[filed];
        b = b[filed];

        if (typeof (primer) != "undefined") {
            a = primer(a);
            b = primer(b);
        }

        if (a < b) {
            return reverse * -1;
        }
        if (a > b) {
            return reverse * 1;
        }
    }
}

function formatFullDate(timestamp) {
    if (!timestamp)
        return '';

    var date = new Date(timestamp);

    return date.getFullYear() + '-'
        + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
        + ('0' + date.getDate()).slice(-2) + ' '
        + ('0' + date.getHours()).slice(-2) + ':'
        + ('0' + date.getMinutes()).slice(-2) + ':'
        + ('0' + date.getSeconds()).slice(-2);
}

function autoReturn(err,result){
    var rtnObj={};
    if(err){
        rtnObj.code=-1;
        rtnObj.message=err;
    }else{
        rtnObj.code=0;
        rtnObj.data=result;
    }
    return rtnObj;
}

exports.stringtojson = function (v) {
    return '"' + v + '"';
}
exports.sortJSONArry = sortJSONArry;
exports.dynamicPassword = dynamicPassword;
exports.distinct = distinct;
exports.getNumByChar = getNumByChar;
exports.getFixedRandomInt = getFixedRandomInt;
exports.getYYMMDD = getYYMMDD;
exports.getYYYYMM = getYYYYMM;
exports.getLastMonthYYYYMM = getLastMonthYYYYMM;
exports.getYYMMDDHH = getYYMMDDHH;
exports.getYYYY_MM_DD = getYYYY_MM_DD;
exports.getFixedInt = getFixedInt;
exports.getYYYYMMDDHH = getYYYYMMDDHH;
exports.getMd5 = getMd5;
exports.getYYYYMMDD = getYYYYMMDD;
exports.parseJSON = parseJSON;
exports.getFilePath = getFilePath;
exports.generateUUID = generateUUID;
exports.formatDate = formatDate;
exports.getDateRange = getDateRange;
exports.encodeURIComponentGBK = encodeURIComponentGBK;
exports.SPLITER = String.fromCharCode(0);
exports.formatFullDate = formatFullDate;
exports.RndNum = RndNum;
exports.checkdate = checkdate;
exports.trimRight = trimRight;
exports.trim = trim;
exports.getYYYY =getYYYY;
exports.autoReturn=autoReturn;


