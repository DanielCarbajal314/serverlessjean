'use strict';
var GenerateTsunamiData = require('./data-loader/database-generators/GenerateTsunamiData').GenerateTsunamiData;
var GenerateVolcanoData = require('./data-loader/database-generators/GenerateVolcanoData').GenerateVolcanoData;
var query = require('./data-access/queries');

module.exports.loadVolcano = (event, context, callback) => {
  GenerateVolcanoData(callback);
};

module.exports.loadTsunami = (event, context, callback) => {
  GenerateTsunamiData(callback); 
};

module.exports.getData = (event, context, callback) => {
  var eventCopy = Object.assign({}, event.body);
  try{
    query.getData(event, context, callback)
  }
  catch(errorEvent){
      var errorObject = formatError(errorEvent,event,eventCopy);
      callback(null,errorObject);
  }
};

module.exports.MapReduceQuery = (event, context, callback) => {
  var eventCopy = Object.assign({}, event.body);
  try{
      query.MapReduceQuery(event, context, callback)
  }
  catch(errorEvent){
      var errorObject = formatError(errorEvent,event,eventCopy);
      callback(null,errorObject);
  }
};

function formatError(errorEvent,event,eventCopy){
    return {
        errorData:errorEvent.stack,
        bodyDataFinal:event.body,
        bodyDataOriginal:eventCopy
    };
}


function leer(){
  var data = {
          tableName: 'Eruptions',
          attributes: ['Year','Country','DEATHS','Month','Day']
      }
  $.ajax({
      url: 'https://lypqoj49qj.execute-api.us-east-2.amazonaws.com/dev/disasters/getData',
      type: 'POST',
      crossDomain: true,
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      success: function(data) {
          console.log(data);
      },
      error: function(xhr, ajaxOptions, thrownError) {
      }
  });
}


