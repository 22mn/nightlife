module.exports = function (result){

	var List = [];

	result.forEach(function(item){
		List.push(item.id);
	});
	
	return List;
}
