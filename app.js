var Info = require('./models/BlogInfo');


var blogInfo = new Info();


var newBlog = {
    title: '测试博客',
    content: '博客内容',
    category: '技术',
    createTime: '1446354205'
};

//console.log('****',blogInfo.insert);

//INSERT
//blogInfo.insert(newBlog).then(function(){
//    blogInfo.db.base_load_all().then(function(result){
//        console.log('%%%%%',result);
//    });
//},function(error){
//    console.log('---error----',error);
//});


//update
//var updateInfo={"title":"测试博客_update","content":"博客内容_update","category":"技术1","createTime":"1446354205","_id":"5296fc08aa96f767193ee59adcb0309c"};
//blogInfo.update(updateInfo).then(function(){
//    blogInfo.db.base_load_all().then(function(result){
//        console.log('%%%%%',result);
//    });
//},function(error){
//    console.log('---error----',error);
//});


//blogInfo.base_load_all().then(function(result){
//        console.log('%%%%%',result);
//});
//


////find
//var identity='5296fc08aa96f767193ee59adcb0309c';
//
//blogInfo.selectInfoByID(identity).then(function(info){
//    console.log('*****select by id*****',info);
//});


//blogInfo.selectInfoByKV({
//    "title":"测试博客_update",
//    "category":"技术1"
//}).then(function(info){
//    console.log('****',info);
//},function(error){
//    console.log('&&&&',error);
//}).catch(function(err){
//    console.log('^^^',err);
//});


blogInfo.selectListByKV({
    "title":"测试博客_update",
    "category":"技术1"
}).then(function(result){
    console.log("&&&&&&",result);
});


