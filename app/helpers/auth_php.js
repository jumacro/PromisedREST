var querystring = require('querystring');
var http = require('http');
//var fs = require('fs');

exports.phpApiLogin = function(Username, Password, callback){

	var post_data = querystring.stringify({
  		'Username' : Username,
      	'Password': Password
  });

	var options = {
	    host: 'api.zergid.com',
	    port: 80,
	    path: '/v1/login_api',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
          	'Content-Length': post_data.length
	    }
	};

	console.log("Start");
	var reqPhp = http.request(options,function(res){
		res.setEncoding('utf8');
	    console.log("Connected");
	    console.log(post_data);
	    res.on('end',function(data){
	        //console.log(data);
	        var result = JSON.parse(data);
	        console.log(result);
	        callback(result);
	    });
	});
	reqPhp.write(post_data);
	reqPhp.end();
}