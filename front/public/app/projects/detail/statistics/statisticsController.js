angular.module("app")
.constant("COLOR_CONFIG", ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'])
.controller("StatistucsController",function($scope){

	$scope.days=1;
	$scope.changeDays = function() {
		$scope.$broadcast('changeDays', {
			days: $scope.days
		});
	}
})
.controller("ProjectDauController", function($scope, StatCache, COLOR_CONFIG, StatDauService){
	var CACHE_PREFIX = "ProjectDauCache-";
	$scope.color = _.shuffle(COLOR_CONFIG);
	$scope.days= 1;
	$scope.cache = StatCache;
	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});

	$scope.refresh = function() {
		if(_.isUndefined($scope.chart) || _.isNull($scope.chart)) {
			$scope.init();
		} else {
			var days = $scope.days;
			var cacheData =  $scope.cache.get(CACHE_PREFIX + days);

			if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
				StatDauService().get({days : days})
				.$promise.then(function(response) {
					var keys = response['app-version'];

					$scope.chart.load({
						json: response.data,
						keys: {
							x: "date",
							value: keys.concat(['total'])
						},
						type: 'bar',
						types: {
							total: 'area',
						},
						groups: [
							keys
						]
					});

					$scope.cache.put(CACHE_PREFIX + days, response);
				});
			} else {
				var keys = cacheData['app-version'];
				$scope.chart.load({
					json: cacheData.data,
					keys: {
						x: "date",
						value: keys.concat(['total'])
					},
					type: 'bar',
					types: {
						total: 'area',
					},
					groups: [
						keys
					]
				});
			}
		}
	};

	$scope.init = function() {
		StatDauService().get({days:1})
		.$promise.then(function(response){
			var keys = response['app-version'];
			$scope.chart = c3.generate({
				bindto: "#dau-bar",
				data: {
					json: response.data,
					keys: {
						x: "date",
						value: keys.concat(['total'])
					},
					type: 'bar',
					types: {
						total: 'area',
					},
					groups: [
						keys
					],
				},
				axis: {
					x: {
						type: 'category'
					}
				},
				color: {
					pattern: $scope.color
				}
			});

			$scope.cache.put(CACHE_PREFIX + 1, response);
		});

	}

	$scope.init();




})
.controller("ProjectCrashRateController", function($scope, StatCache, COLOR_CONFIG, StatCrashRateService){
	var CACHE_PREFIX = "ProjectCrashRateCache-";
	$scope.color = _.shuffle(COLOR_CONFIG);
	$scope.days = 1;
	$scope.cache = StatCache;

	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});

	$scope.refresh = function() {
		if(_.isUndefined($scope.chart) || _.isNull($scope.chart)) {
			$scope.init();
		} else {
			var days = $scope.days;
			var cacheData =  $scope.cache.get(CACHE_PREFIX + days);

			if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
				StatCrashRateService().get({days : days})
				.$promise.then(function(response) {
					var keys = response['app-version'];

					$scope.chart.load({
						json: response.data,
						keys: {
							x:'date',
							value: keys
						},
						types: _.transform(keys, function(result, n){
							result[n] = 'area';
						}),
						groups: [keys]
					});

					$scope.cache.put(CACHE_PREFIX + days, response);
				});
			} else {
				var keys = cacheData['app-version'];
				$scope.chart.load({
					json: cacheData.data,
					keys: {
						x:'date',
						value: keys
					},
					types: _.transform(keys, function(result, n){
						result[n] = 'area';
					}),
					groups: [keys]
				});
			}
		}
	};

	$scope.init = function() {
		StatCrashRateService().get({days: 1})
		.$promise.then(function(response) {
			var keys = response['app-version'];
			$scope.chart = c3.generate({
				bindto:'#crash-rate',
				data: {
					json: response.data,
					keys: {
						x:'date',
						value: keys
					},
					types: _.transform(keys, function(result, n){
						result[n] = 'area';
					}),
					groups: [keys]
				},
				axis: {
					x: {
						type: 'category'
					}
				},
				color: {
					pattern: $scope.color
				}
			});

			$scope.cache.put(CACHE_PREFIX + 1, response);
		});
	};

	$scope.init();







})
.controller("ProjectWorldController", function($scope, StatCache, COLOR_CONFIG, StatWorldeService){
	var CACHE_PREFIX = "ProjectWorldCache-";

	$scope.color = _.shuffle(COLOR_CONFIG);
	$scope.days = 1;
	$scope.cache = StatCache;

	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});

	$scope.refresh = function() {
		if(_.isUndefined($scope.chart) || _.isNull($scope.chart)) {
			$scope.init();
		} else {
			var days = $scope.days;
			var cacheData =  $scope.cache.get(CACHE_PREFIX + days);

			if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
				StatWorldeService().get({days : days})
				.$promise.then(function(response) {
					$scope.chart.load({
						json: response.data,
						keys: {
							x: "location",
							value:["value"]
						},
					});

					$scope.cache.put(CACHE_PREFIX + days, response);
				});
			} else {
				$scope.chart.load({
					json: cacheData.data,
					keys: {
						x: "location",
						value:["value"]
					},
				});
			}
		}
	}

	$scope.init = function() {
		StatWorldeService().get({days:1})
		.$promise.then(function(response) {
			$scope.cache.put(CACHE_PREFIX + 1, response);
			$scope.chart = c3.generate({
				bindto: "#world_vmap_info",
				data: {
					json: response.data,

					keys: {
						x: "location",
						value:["value"]
					},
					labels: true,
					type: 'bar'
				},
				axis: {
					x: {
						type: 'category'
					}
				},

				color: {
					pattern: $scope.color
				},
				legend: {
					show: false
				},
				bar: {
					width: {
						ratio: 0.5 // this makes bar width 50% of length between ticks
					}
				}
			});
		});
	}

	$scope.init();

})
.controller("ProjectVersionController", function($scope, StatCache, COLOR_CONFIG, StatVersionService){
	var CACHE_PREFIX = "ProjectVersionCache-";

	$scope.color = _.shuffle(COLOR_CONFIG);
	$scope.days = 1;
	$scope.cache = StatCache;

	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();

	});

	$scope.refresh = function() {
		if(_.isUndefined($scope.chart) || _.isNull($scope.chart)) {
			$scope.init();
		} else {
			var days = $scope.days;
			var cacheData =  $scope.cache.get(CACHE_PREFIX + days);

			if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
				StatVersionService().get({days : days})
				.$promise.then(function(response) {
					$scope.chart.load({
						json: response.data,
						keys:{
							//x: 'appVersion',
							value: response.keys
						},
						types:_.transform(response.keys, function(result, n){
							result[n] = 'bar';
						}),
						groups: [
							response.keys
						]
					});

					$scope.cache.put(CACHE_PREFIX + days, response);
				});
			} else {
				$scope.chart.load({
					json: cacheData.data,
					keys:{
						//x: 'appVersion',
						value: cacheData.keys
					},
					types:_.transform(cacheData.keys, function(result, n){
						result[n] = 'bar';
					}),
					groups: [
						cacheData.keys
					]
				});
			}
		}
	};


	$scope.init = function() {
		StatVersionService().get({days:1})
		.$promise.then(function(response){
			var data = response.data;
			$scope.cache.put(CACHE_PREFIX + 1, response);
			$scope.chart = c3.generate({
				bindto: '#version-chart',
				data: {
					json: data,
					keys:{
						//x: 'appVersion',
						value: response.keys
					},
					types:_.transform(response.keys, function(result, n){
						result[n] = 'bar';
					}),
					groups: [
						response.keys
					]
				},
				color: {
					pattern: $scope.color
				},
				axis: {
					x: {
						tick: {
							format: function (d) { return data[d].appVersion}
						}
					}
				}
			});
		});
	}

	$scope.init();
})
.controller("DeviceErrorRateController", function($scope, StatCache, StatDeviceService){
	var CACHE_PREFIX = "DeviceErrorRateCache-"
	$scope.cache = StatCache;
	$scope.days = 1;
	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});

	$scope.refresh = function() {
		if(_.isUndefined($scope.chart) || _.isNull($scope.chart)) {
			$scope.init();
		} else {
			var days = $scope.days;
			var cacheData =  $scope.cache.get(CACHE_PREFIX + days);

			if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
				StatDeviceService().get({days : days})
				.$promise.then(function(response) {
					$scope.chart.load({
						json: response.data,
						keys: {
							x: "label",
							value:["value"]
						}
					});

					$scope.cache.put(CACHE_PREFIX + days, response);
				});
			} else {
				$scope.chart.load({
					json: cacheData.data,
					keys: {
						x: "label",
						value:["value"]
					}
				});
			}
		}
	}

	$scope.init = function() {
		StatDeviceService().get({days:1})
		.$promise.then(function(response){
			$scope.cache.put(CACHE_PREFIX + 1, response);
			$scope.chart = c3.generate({
				bindto: "#device-errorrate",
				data: {
					json: response.data,

					keys: {
						x: "label",
						value:["value"]
					},
					labels: true,
					type: 'bar'
				},
				axis: {
					x: {
						type: 'category'
					}
				},

				color: {
					pattern: [ '#9edae5']
				},
				legend: {
					show: false
				},
				bar: {
					width: {
						ratio: 0.5 // this makes bar width 50% of length between ticks
					}
				}
			});
		});
	}
	$scope.init();



})
.controller("classErrorRateController", function($scope, StatCache, StatClassService) {
	var CACHE_PREFIX = "classErrorRateCache-";
	$scope.cache = StatCache;
	$scope.days = 1;

	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});

	$scope.refresh = function(){
		var days = $scope.days;
		var cacheData = $scope.cache.get(CACHE_PREFIX + days);
		if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
			StatClassService().get({days : days})
			.$promise.then(function(response) {
				$scope.data = response.data;
				$scope.cache.put(CACHE_PREFIX + days, response);
			});
		} else {
			$scope.data = cacheData.data;
		}

	};
	$scope.refresh();

	$scope.getItemClass = function(data) {
		if(data.label === 'Others') {
			return 'progress-bar-info';
		}

		if(data.value > 15) {
			return 'progress-bar-danger';
		} else if(data.value > 10){
			return 'progress-bar-warning';
		} else {
			return 'progress-bar-info';
		}
	};


})
.controller("errorActivityController", function($scope, StatCache, StatActivityService) {
	var CACHE_PREFIX = "errorActivityCache-";
	$scope.cache = StatCache;
	$scope.days = 1;


	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});
	$scope.refresh = function(){
		var days = $scope.days;
		var cacheData = $scope.cache.get(CACHE_PREFIX + days);
		if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
			StatActivityService().get({days : days})
			.$promise.then(function(response) {
				$scope.data = response.data;
				$scope.cache.put(CACHE_PREFIX + days, response);
			});
		} else {
			$scope.data = cacheData.data;
		}

	};
	$scope.refresh();



	$scope.getItemClass = function(data) {

		if(data.value > 15) {
			return 'progress-bar-danger';
		} else if(data.value > 10){
			return 'progress-bar-warning';
		} else {
			return 'progress-bar-info';
		}
	};
})
.controller("OsVersionController", function($scope, StatCache,  StatOsVersionService){
	$scope.cache = StatCache;
	$scope.days = 1;

	var CACHEPREFIX = "OsVersionCache-";
	$scope.$on('changeDays', function(e, args) {
		$scope.days = args.days;
		$scope.refresh();
	});
	$scope.refresh = function(){
		var days = $scope.days;
		var cacheData = $scope.cache.get(CACHEPREFIX + days);
		if(_.isUndefined(cacheData) || _.isNull(cacheData)) {
			StatOsVersionService().get({days : days})
			.$promise.then(function(response) {
				$scope.data = response.data;
				$scope.cache.put(CACHEPREFIX + days, response);
			});
		} else {
			$scope.data = cacheData.data;
		}

	};
	$scope.refresh();


	$scope.getItemClass = function(data) {

		if(data.value > 15) {
			return 'progress-bar-danger';
		} else if(data.value > 10){
			return 'progress-bar-warning';
		} else {
			return 'progress-bar-info';
		}
	};
});