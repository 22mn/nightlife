


module.exports = function (result){

	var List = [];

	result.forEach(function(item){
		List.push([item.name,item.rating,item.location.address1,item.url,item.image_url,item.display_phone,item.coordinates.latitude,item.coordinates.longitude,item.id]);
	});
	
	return List;
}
