var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
AWS.config.update({accessKeyId: 'AKIAJ3JNKAOGAFZIKEGQ', secretAccessKey: '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'});
var s3 = new AWS.S3();
  s3.listBuckets(function(err, data) {
    if (err) { console.log("Error:", err); }
    else {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
      }
    }
  });
