function generateUUID(length) {
    var id = '',
        length = length || 32;
    while (length--)
        id += (Math.random() * 16 | 0) % 2 ? (Math.random() * 16 | 0).toString(16) : (Math.random() * 16 | 0).toString(16).toUpperCase();
    return id.toLowerCase();
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
        var e = [''];
        for (var j = 0; j < b.length; j++)
            e.push(b.toString('hex', j, j + 1).toUpperCase());
        a[i] = e.join('%');
    }
    return a.join('');
}


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

function autoReturn(err, result) {
    var rtnObj = {};
    if (err) {
        rtnObj.code = -1;
        rtnObj.message = err;
    } else {
        rtnObj.code = 0;
        rtnObj.data = result;
    }
    return rtnObj;
}

exports.stringtojson = function (v) {
    return '"' + v + '"';
}
exports.sortJSONArry = sortJSONArry;
exports.parseJSON = parseJSON;
exports.generateUUID = generateUUID;
exports.encodeURIComponentGBK = encodeURIComponentGBK;
exports.formatFullDate = formatFullDate;
exports.autoReturn = autoReturn;
exports.generateUUID = generateUUID;


