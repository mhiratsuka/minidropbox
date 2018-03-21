'use strict';

const fetch = require('node-fetch');
const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
const present = new Date();
let now = present.toLocaleString();

module.exports.s3fetch = (event, context, callback) => {
  const data = JSON.parse(event.body);
  
  const dbparams = {
              TableName: 'minidropbox',
              Item: {
                name: data.key,
                date: now
              }
            };
  
  fetch(data.image_url)
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
        Key: data.key,
        Body: buffer,
      }).promise()
    ))
    .then(
        dynamoDb.put(dbparams, (error, result) =>{
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
          })
    )
    .then(v => callback(null, v), callback);
};