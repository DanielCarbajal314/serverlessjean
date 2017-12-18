exports.mapReduce = function mapReduce(data,event){
    var mapedData = mapData(data,event);
    var mapreducedData = reduceData(mapedData);
    return  mapreducedData;
}

function mapData(data,event){
    var groupingKey=event.body.groupingKey;
    var groupinValue=event.body.groupinValue;
    return data.map(function(node) {
        return {
            key: node[groupingKey],
            value: groupinValue?node[groupinValue]:1
        }
    });
}

function reduceData(mappedData){
    return  mappedData.reduce(function(acumulator, mapedNode) {
                value = mapedNode.value||0;
                if (acumulator[mapedNode.key]){
                    acumulator[mapedNode.key]+=value;
                }
                else{
                    acumulator[mapedNode.key]=value;
                }
                return acumulator;
            }, {});
}