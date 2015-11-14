var util = require('util');
var _dbBase = require('../lib/_dbBase');


function BlogInfo() {
    _dbBase.call(this,'blog');
}


util.inherits(BlogInfo, _dbBase);

module.exports = BlogInfo;
