var datalib = require('datalib');
var GenerateData = require('./GenerateData').GenerateData;
var DataPipe = require('./DataPipe').DataPipe;

exports.GenerateTsunamiData = ()=>{
    var tsunamiDataPipe = new DataPipe();
    tsunamiDataPipe.filePath = './data-loader/raw-data/tsevent.txt.tsv';
    tsunamiDataPipe.tableName = 'Tsunamies';
    tsunamiDataPipe.tableKey = 'TsunamiId';
    GenerateData(tsunamiDataPipe);
}