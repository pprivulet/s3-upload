var logger = require('koa-logger');
var views = require('co-views');
var serve = require('koa-static');
var koa = require('koa');
var fs = require('fs');
var app = koa();
var os = require('os');
var path = require('path');

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
AWS.config.update({
  accessKeyId: 'AKIAJ3JNKAOGAFZIKEGQ', 
  secretAccessKey: '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'
});

var route = require('koa-route');
app.use(route.get('/', profile));
app.use(route.get('/sign_s3', sign_s3));
app.use(serve('public'));

var render= views(__dirname + '/public', { map: { html: 'swig' }});
app.use(logger());
app.use(function *(next){
  yield next;
  if (this.body || !this.idempotent) return;
  this.redirect('/404.html');
});


/*
function *list(next){
    var params = {Bucket: 'demo-00', Key: 'nodejs.png'};
    var s3 = new AWS.S3(params);
    var url = s3.getSignedUrl('getObject', params);
    this.body = yield render('list', {url: url});
    	
};
*/

function *profile(next) {
  this.body = yield render('new');
}
   	
function *sign_s3(next){
    filename = this.query.file_name;    
    var s3 = new AWS.S3();
    var return_data;
    var s3_params = {
      Bucket: 'demo-00',
      Key: this.query.file_name,
      Expires: 60,
      ContentType: this.query.file_type,
      ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
      if(err){
        console.log(err);
      }
      else{
        return_data = {
          signed_request: data,
          url: 'https://'+'demo-00'+'.s3.amazonaws.com/'+filename
        };      
      }
    });
    this.body = return_data;
}

app.listen(3000);
console.log('listening on port 3000');
