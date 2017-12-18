var datalib = require('datalib');
const AWS = require('aws-sdk');  
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();
var callbackResponse;

exports.GenerateData = (dataPipe, callback)=>{
    callbackResponse=callback;
    var filePath= dataPipe.filePath;
    var tableName= dataPipe.tableName;
    var tableKey = dataPipe.tableKey;
    var DataList = datalib.tsv(filePath);
    var ChucksOf24 = createGroupedArray(DataList,24)
    ChucksOf24.forEach(function(singleRequest) {
        var dynamoRequest = getRequest(tableName);
        singleRequest.forEach(function(dataNode) {
            dataNode[tableKey]=uuid.v1();
            var record = generateRecord(dataNode);
            dynamoRequest.RequestItems[tableName].push(record);
        });
        dynamo.batchWrite(dynamoRequest,errorCallback);
    });
}

function generateRecord(dataNode){
    return{
                PutRequest: {
                Item: dataNode
                }
          };
}

function getRequest(tableName){
   requestNode={
        RequestItems:{}
   };
   requestNode.RequestItems[tableName]=[]
   return requestNode;
}

function errorCallback(err, data) {
    if (err) {
        console.log("Error", err);
        callbackResponse(err, data);
    } else {
        console.log("Success", data);
    }
}

var createGroupedArray = function(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
}
