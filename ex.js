
var http = require('http');
var cp = require('child_process');

http.createServer(function (req, res) 
{
  	var chunk;
  	console.log("[200] " + req.method + " to " + req.url);
  	var fullBody = '';
  	req.on('data', function(chunk) 
	{
    		fullBody += chunk.toString();
  	}
        );
 
	req.on('end', function() 
	{
    	var obj = JSON.parse(fullBody);
		console.log(obj.after + '\n' + obj.before + '\n' +obj.ref);

		//handleRequest2(obj, obj.commits[0]);

		for (var i = 0; i < obj.commits.length; i++) {
			handleRequest2(obj, obj.commits[i]);
		}

        res.writeHead(200, {'Content-Type': 'text/plain'});
    	res.end('Hello World\n');
	});
		

}).listen(9450);
console.log('Server running at port 9450');

function handleRequest2(obj, commit)
{
	var message = commit.message;
	var idval = "";
	var id_patt = new RegExp(/id [0-9]+/);
	idval = message.match(id_patt);
	idval = idval+'';
	idval = idval.split(' ');
	console.log("Id = " + idval[1]);
	var data = "";
	data = data + "gitUser=" + commit.committer.username;
	data = data + "&repositoryKey=528d5075c7c2472b8096e310414bb9db";
	data = data + "&commitSha1=" + commit.id;
	data = data + "&commitComment=" + commit.message;
	data = data + "&committerName=" + commit.committer.username;
	data = data + "&committerEmail=" + commit.committer.email;
	data = data + "&creationDate=" + commit.timestamp;
	data = data + "&impersonateAs=" + commit.committer.username;
	data = data + "&workitemIDs"+idval[1];

	console.log("Data = " + data);

	data = encodeURI(data);

	console.log("Data = " + data);

	var ls = cp.spawn('curl', [
		'-k',
		'-H',
		'Accept:text/json',
		'-H',
		'Content-type:application/x-www-form-urlencoded',
		'-H',
		'x-com-ibm-team-git-auth:true',
		'-X',
		'POST',
		'--data',
		data,
		'https\:\/\/localhost\:9443\/ccm\/service\/com.ibm.team.git.common.internal.IGitWorkItemInvokeService/AssociateWorkItem']);
		//'https\:\/\/jazz.net\/sandbox02\-ccm\/service\/com.ibm.team.git.common.internal.IGitWorkItemInvokeService/AssociateWorkItem']);
		//'https\:\/\/bnegl139.in.ibm.com\:9444\/ccm\/service\/com.ibm.team.git.common.internal.IGitWorkItemInvokeService/AssociateWorkItem']);

	ls.stdout.on('data', function (data) {
	    console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
	    console.log('stderr: ' + data);
	});

	ls.on('close', function (code) {
	    console.log('child process exited with code ' + code);
	});
}

function handleRequest(obj, commit)
{
	var options = {
  		hostname: 'bnegl139.in.ibm.com',
  		port: 9444,
  		path: '/ccm/service/com.ibm.team.git.internal.IGitWorkItemInvokeService/AssociateWorkItem',
  		method: 'POST',
		headers: {
			'Content-Type' : 'application/x-www-form-urlencoded',
			'Accept' : '*/*',
			'Content-Encoding' : 'utf8'
		}
    };



	console.log("Creating request object with " + JSON.stringify(options) + "\n");

	var req = http.request(options, function(res) {
  		console.log('STATUS: ' + res.statusCode);
  		console.log('HEADERS: ' + JSON.stringify(res.headers));
  		res.setEncoding('utf8');
  		res.on('data', function (chunk) {
  	  		console.log('BODY: ' + chunk);
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
		console.log(e);
	});

	var data = "";

	data = data + "repositoryKey=18b104bc005e45669e79d190e7d370bc";
	data = data + "&commitSha1=" + commit.id;
	data = data + "&commitComment=" + commit.message;
	data = data + "&committerName=" + commit.committer.username;
	data = data + "&committerEmail=" + commit.committer.email;
	data = data + "&creationDate=" + commit.timestamp;
	data = data + "&impersonateAs=" + commit.committer.username;
	data = data + "&workitemIDs=5&workitemIDs=6";

	console.log("Data = " + data);

	data = encodeURI(data);

	console.log("Data = " + data);

	req.setHeader('Content-Length', data.length);

	// write data to request body
	req.write(data);
	req.end();
}
