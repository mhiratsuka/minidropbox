'use strict';

const fetch = require('node-fetch');
const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const present = new Date();
const params = {
              TableName: 'minidropbox',
              Item: {
                name: event.key,
                date: present
              }
            };

const s3 = new AWS.S3();

module.exports.s3fetch = (event, context, callback) => {
  fetch(event.image_url)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(new Error(
            `Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
    })
    .then(response => response.buffer())
    .then(buffer => (
      s3.putObject({
        Bucket: process.env.BUCKET,
        Key: event.key,
        Body: buffer,
      }).promise()
    ))
    .then(v => callback(null, v), callback);

    
      dynamoDb.put(params, (error, result) =>{
            if (error) {
              console.error(error);
              callback(new Error('Unable to add image info.'));
              return;
            }

            const response = {
              statusCode: 200,
              body: JSON.stringify(result.Item)
            }

            callback(null, response);
          });
};