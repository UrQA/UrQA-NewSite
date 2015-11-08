angular.module("app")
.controller('userController', function($scope, UserInfoService){
	UserInfoService().get({})
	.$promise.then(function(response) {
		$scope.user = {};
		$scope.user.name = response.user_name;
		$scope.user.profile = response.profile_url;
		$scope.user.email = response.user_email;
	}, function(response) {
		alert("사용자 정보를 불러올 수 없습니다.");
	});
});

