angular.module('services', [])

.factory('Photos', function(){
	return {
		all: function(){
			var photoString = window.localStorage['photos'];
			if(photoString){
				return angular.fromJson(photoString);
			}
			return [];
		},
		
		save: function(photos){
			window.localStorage['photos'] = angular.toJson(photos);
		},
		
		newPhoto: function(image){
			return {
			image: image
			};
		}
	}
});