angular.module('app').constant('COLOR_CONFIG', [
  '#1f77b4'
  '#aec7e8'
  '#ff7f0e'
  '#ffbb78'
  '#2ca02c'
  '#98df8a'
  '#d62728'
  '#ff9896'
  '#9467bd'
  '#c5b0d5'
  '#8c564b'
  '#c49c94'
  '#e377c2'
  '#f7b6d2'
  '#7f7f7f'
  '#c7c7c7'
  '#bcbd22'
  '#dbdb8d'
  '#17becf'
  '#9edae5'
]).controller('StatistucsController', ($scope) ->
  $scope.days = 1

  $scope.changeDays = ->
    $scope.$broadcast 'changeDays', days: $scope.days

).controller('ProjectDauController', ($scope, StatCache, COLOR_CONFIG, StatDauService) ->
  CACHE_PREFIX = 'ProjectDauCache-'
  $scope.color = _.shuffle(COLOR_CONFIG)
  $scope.days = 1
  $scope.cache = StatCache
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()

  $scope.refresh = ->
    if _.isUndefined($scope.chart) or _.isNull($scope.chart)
      $scope.init()
    else
      days = $scope.days
      cacheData = $scope.cache.get(CACHE_PREFIX + days)
      if _.isUndefined(cacheData) or _.isNull(cacheData)
        StatDauService().get(days: days).$promise.then (response) ->
          keys = response['app-version']
          $scope.chart.load
            json: response.data
            keys:
              x: 'date'
              value: keys.concat([ 'total' ])
            type: 'bar'
            types: total: 'area'
            groups: [ keys ]
          $scope.cache.put CACHE_PREFIX + days, response

      else
        keys = cacheData['app-version']
        $scope.chart.load
          json: cacheData.data
          keys:
            x: 'date'
            value: keys.concat([ 'total' ])
          type: 'bar'
          types: total: 'area'
          groups: [ keys ]

  $scope.init = ->
    StatDauService().get(days: 1).$promise.then (response) ->
      keys = response['app-version']
      $scope.chart = c3.generate(
        bindto: '#dau-bar'
        data:
          json: response.data
          keys:
            x: 'date'
            value: keys.concat([ 'total' ])
          type: 'bar'
          types: total: 'area'
          groups: [ keys ]
        axis: x: type: 'category'
        color: pattern: $scope.color)
      $scope.cache.put CACHE_PREFIX + 1, response


  $scope.init()

).controller('ProjectCrashRateController', ($scope, StatCache, COLOR_CONFIG, StatCrashRateService) ->
  CACHE_PREFIX = 'ProjectCrashRateCache-'
  $scope.color = _.shuffle(COLOR_CONFIG)
  $scope.days = 1
  $scope.cache = StatCache
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()

  $scope.refresh = ->
    if _.isUndefined($scope.chart) or _.isNull($scope.chart)
      $scope.init()
    else
      days = $scope.days
      cacheData = $scope.cache.get(CACHE_PREFIX + days)
      if _.isUndefined(cacheData) or _.isNull(cacheData)
        StatCrashRateService().get(days: days).$promise.then (response) ->
          keys = response['app-version']
          $scope.chart.load
            json: response.data
            keys:
              x: 'date'
              value: keys
            types: _.transform(keys, (result, n) ->
              result[n] = 'area'
            )
            groups: [ keys ]
          $scope.cache.put CACHE_PREFIX + days, response

      else
        keys = cacheData['app-version']
        $scope.chart.load
          json: cacheData.data
          keys:
            x: 'date'
            value: keys
          types: _.transform(keys, (result, n) ->
            result[n] = 'area'
          )
          groups: [ keys ]


  $scope.init = ->
    StatCrashRateService().get(days: 1).$promise.then (response) ->
      keys = response['app-version']
      $scope.chart = c3.generate(
        bindto: '#crash-rate'
        data:
          json: response.data
          keys:
            x: 'date'
            value: keys
          types: _.transform(keys, (result, n) ->
            result[n] = 'area'
          )
          groups: [ keys ]
        axis: x: type: 'category'
        color: pattern: $scope.color)
      $scope.cache.put CACHE_PREFIX + 1, response


  $scope.init()

).controller('ProjectWorldController', ($scope, StatCache, COLOR_CONFIG, StatWorldeService) ->
  CACHE_PREFIX = 'ProjectWorldCache-'
  $scope.color = _.shuffle(COLOR_CONFIG)
  $scope.days = 1
  $scope.cache = StatCache
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()


  $scope.refresh = ->
    if _.isUndefined($scope.chart) or _.isNull($scope.chart)
      $scope.init()
    else
      days = $scope.days
      cacheData = $scope.cache.get(CACHE_PREFIX + days)
      if _.isUndefined(cacheData) or _.isNull(cacheData)
        StatWorldeService().get(days: days).$promise.then (response) ->
          $scope.chart.load
            json: response.data
            keys:
              x: 'location'
              value: [ 'value' ]
          $scope.cache.put CACHE_PREFIX + days, response

      else
        $scope.chart.load
          json: cacheData.data
          keys:
            x: 'location'
            value: [ 'value' ]


  $scope.init = ->
    StatWorldeService().get(days: 1).$promise.then (response) ->
      $scope.cache.put CACHE_PREFIX + 1, response
      $scope.chart = c3.generate(
        bindto: '#world_vmap_info'
        data:
          json: response.data
          keys:
            x: 'location'
            value: [ 'value' ]
          labels: true
          type: 'bar'
        axis: x: type: 'category'
        color: pattern: $scope.color
        legend: show: false
        bar: width: ratio: 0.5)


  $scope.init()

).controller('ProjectVersionController', ($scope, StatCache, COLOR_CONFIG, StatVersionService) ->
  CACHE_PREFIX = 'ProjectVersionCache-'
  $scope.color = _.shuffle(COLOR_CONFIG)
  $scope.days = 1
  $scope.cache = StatCache
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()


  $scope.refresh = ->
    if _.isUndefined($scope.chart) or _.isNull($scope.chart)
      $scope.init()
    else
      days = $scope.days
      cacheData = $scope.cache.get(CACHE_PREFIX + days)
      if _.isUndefined(cacheData) or _.isNull(cacheData)
        StatVersionService().get(days: days).$promise.then (response) ->
          $scope.chart.load
            json: response.data
            keys: value: response.keys
            types: _.transform(response.keys, (result, n) ->
              result[n] = 'bar'
            )
            groups: [ response.keys ]
          $scope.cache.put CACHE_PREFIX + days, response
      else
        $scope.chart.load
          json: cacheData.data
          keys: value: cacheData.keys
          types: _.transform(cacheData.keys, (result, n) ->
            result[n] = 'bar'
          )
          groups: [ cacheData.keys ]


  $scope.init = ->
    StatVersionService().get(days: 1).$promise.then (response) ->
      data = response.data
      $scope.cache.put CACHE_PREFIX + 1, response
      $scope.chart = c3.generate(
        bindto: '#version-chart'
        data:
          json: data
          keys: value: response.keys
          types: _.transform(response.keys, (result, n) ->
            result[n] = 'bar'
          )
          groups: [ response.keys ]
        color: pattern: $scope.color
        axis: x: tick: format: (d) ->
          data[d].appVersion
      )


  $scope.init()

).controller('DeviceErrorRateController', ($scope, StatCache, StatDeviceService) ->
  CACHE_PREFIX = 'DeviceErrorRateCache-'
  $scope.cache = StatCache
  $scope.days = 1
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()


  $scope.refresh = ->
    if _.isUndefined($scope.chart) or _.isNull($scope.chart)
      $scope.init()
    else
      days = $scope.days
      cacheData = $scope.cache.get(CACHE_PREFIX + days)
      if _.isUndefined(cacheData) or _.isNull(cacheData)
        StatDeviceService().get(days: days).$promise.then (response) ->
          $scope.chart.load
            json: response.data
            keys:
              x: 'label'
              value: [ 'value' ]
          $scope.cache.put CACHE_PREFIX + days, response

      else
        $scope.chart.load
          json: cacheData.data
          keys:
            x: 'label'
            value: [ 'value' ]


  $scope.init = ->
    StatDeviceService().get(days: 1).$promise.then (response) ->
      $scope.cache.put CACHE_PREFIX + 1, response
      $scope.chart = c3.generate(
        bindto: '#device-errorrate'
        data:
          json: response.data
          keys:
            x: 'label'
            value: [ 'value' ]
          labels: true
          type: 'bar'
        axis: x: type: 'category'
        color: pattern: [ '#9edae5' ]
        legend: show: false
        bar: width: ratio: 0.5)


  $scope.init()

).controller('classErrorRateController', ($scope, StatCache, StatClassService) ->
  CACHE_PREFIX = 'classErrorRateCache-'
  $scope.cache = StatCache
  $scope.days = 1
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days


  $scope.refresh = ->
    days = $scope.days
    cacheData = $scope.cache.get(CACHE_PREFIX + days)
    if _.isUndefined(cacheData) or _.isNull(cacheData)
      StatClassService().get(days: days).$promise.then (response) ->
        $scope.data = response.data
        $scope.cache.put CACHE_PREFIX + days, response
    else
      $scope.data = cacheData.data


  $scope.refresh()

  $scope.getItemClass = (data) ->
    if data.label == 'Others'
      return 'progress-bar-info'
    if data.value > 15
      'progress-bar-danger'
    else if data.value > 10
      'progress-bar-warning'
    else
      'progress-bar-info'

).controller('errorActivityController', ($scope, StatCache, StatActivityService) ->
  CACHE_PREFIX = 'errorActivityCache-'
  $scope.cache = StatCache
  $scope.days = 1
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()


  $scope.refresh = ->
    days = $scope.days
    cacheData = $scope.cache.get(CACHE_PREFIX + days)
    if _.isUndefined(cacheData) or _.isNull(cacheData)
      StatActivityService().get(days: days).$promise.then (response) ->
        $scope.data = response.data
        $scope.cache.put CACHE_PREFIX + days, response
    else
      $scope.data = cacheData.data


  $scope.refresh()

  $scope.getItemClass = (data) ->
    if data.value > 15
      'progress-bar-danger'
    else if data.value > 10
      'progress-bar-warning'
    else
      'progress-bar-info'

).controller 'OsVersionController', ($scope, StatCache, StatOsVersionService) ->
  $scope.cache = StatCache
  $scope.days = 1
  CACHEPREFIX = 'OsVersionCache-'
  $scope.$on 'changeDays', (e, args) ->
    $scope.days = args.days
    $scope.refresh()


  $scope.refresh = ->
    days = $scope.days
    cacheData = $scope.cache.get(CACHEPREFIX + days)
    if _.isUndefined(cacheData) or _.isNull(cacheData)
      StatOsVersionService().get(days: days).$promise.then (response) ->
        $scope.data = response.data
        $scope.cache.put CACHEPREFIX + days, response
    else
      $scope.data = cacheData.data


  $scope.refresh()

  $scope.getItemClass = (data) ->
    if data.value > 15
      'progress-bar-danger'
    else if data.value > 10
      'progress-bar-warning'
    else
      'progress-bar-info'


# ---
# generated by js2coffee 2.1.0
