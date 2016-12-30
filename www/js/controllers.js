angular.module('controllers', [])

.controller('MainCtrl', function($scope, $state, $ionicModal) {
	
	console.log('MainCtrl');

	$scope.data={
		showDelete: false
	};

	$scope.photos= [
		{image: 'http://placehold.it/300*300'},
		{image: 'http://placehold.it/300*350'},
		{image: 'http://placehold.it/300*300'}
	];

	$scope.onPhotoDelete = function(photo){
		$scope.photos.splice($scope.photos.indexOf(photo), 1);
	};

	$ionicModal.fromTemplateUrl('templates/play-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'})
		.then(function(modal) {
			$scope.modal = modal;
		});

	$scope.openModal = function() {
		$scope.modal.show();

		var imagePlayer = document.getElementById('imagePlayer');
		var i = 0;
		
		$scope.imagePlayerInterval = setInterval(function(){
			if(i < $scope.photos.length){
				imagePlayer.src = $scope.photos[i].image;
				i++;
			}
			else {
				clearInterval($scope.imagePlayerInterval);
			}
		}, 500);
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
	$scope.$on('$destroy', function() {
		$scope.modal.remove();
	});
})

.controller('PhotoViewerCtrl', function($scope) {
	
	console.log('PhotoViewerCtrl');
	
	$scope.replayImages = function(){
	
		var imagePlayer = document.getElementById('imagePlayer');
		var i = 0;
		//Clear any interval already set
		clearInterval($scope.imagePlayerInterval);
		//Restart
		$scope.imagePlayerInterval = setInterval(function(){
			if(i < $scope.photos.length){
				imagePlayer.src = $scope.photos[i].image;
				i++;
			}
			else {
				clearInterval($scope.imagePlayerInterval);
			}
		}, 500);
	};
});
