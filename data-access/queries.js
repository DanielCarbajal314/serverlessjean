const AWS = require('aws-sdk');  
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();
var mapReduce= require('./MapReduce').mapReduce;

exports.getData=(event, context, callback)=>{
    var query = getQuery(event);
    dynamo.scan(query, (error, data) => {
        if (error){
            callback(error+" - "+JSON.stringify(query),data);
        } 
        else{
            callback(null,data);
        } 
    });
}

function queryParameters (event) {
    this.tableName=event.body.tableName;
    this.attributes=event.body.attributes;
    return this;
}

function getQuery(event){
    parameters = new queryParameters(event)
    var query  = {
        TableName: parameters.tableName,
        ProjectionExpression: generateProjectionExpresion(parameters.attributes),
        ExpressionAttributeNames:generateExpressionAttributeNames(parameters.attributes)
    };
    return query;
}

exports.MapReduceQuery=(event, context, callback)=>{
    processEvent(event);
    var query = getQuery(event);
    dynamo.scan(query, (error, data) => {
        if (error){
        callback(error,data);
        } 
        else{
            var mapReducedData = mapReduce(data.Items,event);
            callback(null,mapReducedData);
        } 
    });
}

function processEvent(event){
    event.body.attributes = [];
    event.body.attributes.push(event.body.groupingKey);
    if (event.body.groupinValue){
        event.body.attributes.push(event.body.groupinValue);
    }
}

function generateProjectionExpresion(attributes){
    var attributesCopy = attributes.slice();
    var head = attributesCopy.pop();
    var ProjectionExpresion = '#A'+head + '';
    attributesCopy.forEach(function(attribute) {
        ProjectionExpresion=ProjectionExpresion+', #A'+attribute;
    });
    return ProjectionExpresion;
}

function generateExpressionAttributeNames(attributes){
    var ExpressionAttributeNames = {};
    attributes.forEach(function(attribute) {
        ExpressionAttributeNames['#A'+attribute]=attribute;
    });
    return ExpressionAttributeNames;
}

//REF
//http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.NodeJs.04.html


