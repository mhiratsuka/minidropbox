#  minidropbox 
Make mini dropbox (only back-end) that can store an image in s3 and write the info automatically in dynamoDB. Also when being deleted the image in s3, the info in dynamoDB would be deleated as well.

## The purpose of this application
To learn how to use s3, DynamoDB and the serverless framework.

### How can it be testesd? 

#### postman
<br/>

#### Store(Post) an image
Choose "POST", type URL in the box next to the http method and JSON data in the Body like
{"image_url": "https://assets-cdn.github.com/images/modules/open_graph/github-mark.png", 
"key": "github.png"}
<br/>

#### Get all image information 
Choose "GET" and type URL in the box next to the http method
<br/>

#### Delete an image from s3 and change status in dynamoDB
Choose "PUT" and type URL/{name} in the box next to the http method and JSON data in the Body like
{"key": "github.png"}
<br/>

### What I used
Javascript, AWS s3, AWS DynamoDB, Serverless Framework
