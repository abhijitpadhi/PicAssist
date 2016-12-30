angular.module('controllers', [])

.controller('MainCtrl', function($scope, $state, $ionicModal, $cordovaCamera,
$cordovaFile, $cordovaDialogs, $cordovaSocialSharing, Photos) {
	
	console.log('MainCtrl');

	$scope.data={
		showDelete: false
	};
/*
	$scope.photos= [
		{image: 'http://placehold.it/300*300'},
		{image: 'http://placehold.it/300*350'},
		{image: 'http://placehold.it/300*300'}
	];
*/
	$scope.photos = Photos.all();

	$scope.createPhoto = function(image){
		var newPhoto = Photos.newPhoto(image);
		$scope.photos.push(newPhoto);
		Photos.save($scope.photos);
	};

	$scope.onPhotoDelete = function(photo){
		$scope.photos.splice($scope.photos.indexOf(photo), 1);
		Photos.save($scope.photos);
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

	$scope.takePicture = function(){
	var options = {
	quality: 100,
	destinationType: Camera.DestinationType.FILE_URI, //return a path to the image on the device
	sourceType: Camera.PictureSourceType.CAMERA,
	encodingType: Camera.EncodingType.JPEG,
	cameraDirection: 1, //front facing camera
	saveToPhotoAlbum: true //save a copy to the users photo album as well
	};
	$cordovaCamera.getPicture(options).then(function(imagePath){
	//Grab the file name
	var currentName = imagePath.replace(/^.*[\\\/]/, '');
	var image;
	//Create new name
	var d = new Date(),
	n = d.getTime(),
	newFileName = n + ".jpg";
	if(ionic.Platform.isIOS()){
	//Move the file to permanent storage
	$cordovaFile.moveFile(cordova.file.tempDirectory, currentName,
	cordova.file.dataDirectory, newFileName).then(function(success){
	//File successfully moved, save the photo
	//nativeURL is the path to where the photo is stored permanently on the device
	$scope.createPhoto(success.nativeURL);
	image = success.nativeURL;
	}, function(error){
	//error
	console.log(error);
	});
	}
	else {
	$scope.createPhoto(imagePath);
	image = imagePath;
	}
	//Facebook share option
	$cordovaDialogs.confirm('Your photo has been added. Would you like to share it on Facebook?',
	'Success!', ['No','Yes!']).then(function(buttonIndex) {
	var btnIndex = buttonIndex;
	if(btnIndex == 2){
	var message = "This message will be uploaded to Facebook";
	var link = "http://www.example.com";
	$cordovaSocialSharing.shareViaFacebook(message, image,
	link).then(function(result) {
	$cordovaDialogs.alert('Your photo was shared to Facebook', 'Done',
	'Cool');
	}, function(err) {
	$cordovaDialogs.alert('Sorry! Your photo could not be shared to Facebook.',
	'Error', 'Ok');
	});
	}
	});
	}, function(err){
	//An error occured
	$cordovaDialogs.alert('Sorry, your photo did not work!', 'Error', 'I\'ll try later');
	});
	};
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
})
