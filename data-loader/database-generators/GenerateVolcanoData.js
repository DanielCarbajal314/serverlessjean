var datalib = require('datalib');
var GenerateData = require('./GenerateData').GenerateData;
var DataPipe = require('./DataPipe').DataPipe;

exports.GenerateVolcanoData = (callback)=>{
    var volcanoDataPipe = new DataPipe();
    volcanoDataPipe.filePath = './data-loader/raw-data/volerup.txt.tsv';
    volcanoDataPipe.tableName = 'Eruptions';
    volcanoDataPipe.tableKey = 'EruptionId';
    GenerateData(volcanoDataPipe, callback);
}