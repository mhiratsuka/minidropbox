'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();


module.exports.delete = (event, context, callback) => {

	const s3params = {
	  Bucket: "minidropboxserverless",
	  Key: event.pathParameters.name
	};

	s3.deleteObject(s3params, function(err, data) {
	   if (err) {
	   		console.log(err, err.stack) // an error occurred
	   }else {
	   		dbDelete();
	   		console.log(data);           // successful response
	   }     
	 });

	function dbDelete() {
			const dbparams = {
				TableName: 'minidropbox',
				Key: {
					name: event.pathParameters.name
				}
			};

		dynamoDb.delete(dbparams, (error, result) =>{
			if (error) {
				console.error(error);
				callback(new Error('Unable to remove the image info.'));
				return;
			}

			const response = {
				statusCode: 200,
				body: JSON.stringify({})
			};

			callback(null, response);
		});
	}

};