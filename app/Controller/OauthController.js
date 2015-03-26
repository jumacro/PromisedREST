/**
Oauth controller
*/

var OauthClient = require('../Model/OauthClient');

// Create endpoint /api/client for POST
exports.postClients = function(req, res) {
	// Create a new instance of the Client model
	var client = new OauthClient();
	var param = req.body;
	// Set the client properties that came from the POST data
	var client = new OauthClient({
        name: param.name,
        clientId: param.clientId,
        clientSecret: param.clientSecret,
        userId: param.userId
    });

	// Save the client and check for errors
	client.save(function(err) {
		if (err){
			console.log(err);
			res.end();
		}else{
			res.json({ message: 'Client is added!', data: client });
		}
	});
};

// Create endpoint /api/clients for GET
exports.getClients = function(req, res) {
	// Use the Client model to find all clients
	Client.find({ userId: req.user._id }, function(err, clients) {
		if (err) {
			console.log(err);
			res.end();
		}else{
			res.json(clients);	
		}    
	});
};
