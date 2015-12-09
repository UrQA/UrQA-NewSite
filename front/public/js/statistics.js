$(document).ready(function()
{
	var total_errorcount;

	$.ajax({
		url:'/api/dashboard/project/'+urqaio.currentProject+'/weekly/error',
		async: false,
		success:function(data){
			total_errorcount = data.data;
		}
	});
	//urqaio.currentProject
	// daily error count area graph
	$.ajax({
		url: '/api/dashboard/project/'+urqaio.currentProject+'/daily/error',
		success:function(data){
			var chart_data =[];

			for(var i = 0; i < data.length; i++){
				var datetime = new Date(data[i][0]);
				var mm = (datetime.getMonth()+1).toString();
				var dd = datetime.getDate().toString();
				var elapsed = (mm[1] ? mm : '0' + mm[0])+'/'+(dd[1] ? dd : '0' + dd[0]);
				var value = data[i][1];
				var element = {};
				element.elapsed =  elapsed;
				element.value = value;
				chart_data.push(element);
			}

			Morris.Area({
				element: 'crash-rate',
				data: chart_data,
				xkey: 'elapsed',
				ykeys: ['value'],
				labels: ['value'],
				lineColors:['#79D1CF'],
				parseTime: false
			});
		}
	});

	// error rank rate donut graph
	$.ajax({
		url:'/api/dashboard/project/' + urqaio.currentProject + '/weekly/rank',
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
				var element = {};
				element.value =  data[i].count;
				element.label = data[i].rank;
				element.formatted = ((data[i].count/total_errorcount) * 100).toFixed(1) + '%';
				chart_data.push(element);
			}
			Morris.Donut({
				element: 'graph-donut-rank',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var chart_data = [{
				value: 100,
				label: 'unknown',
				formatted: 0+'%'
			}];

			Morris.Donut({
				element: 'graph-donut-rank',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		}
	});

	// error osversion rate donut graph
	$.ajax({
		url: '/api/statistics/project/' + urqaio.currentProject + '/osversion',
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
				var element = {};
				element.value =  data[i].count;
				element.label = data[i].osversion;
				element.formatted = ((data[i].count/total_errorcount) * 100).toFixed(1) + '%';
				chart_data.push(element);
			}

			Morris.Donut({
				element: 'graph-donut-sdk',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var chart_data = [{
				value: 100,
				label: 'unknown',
				formatted: 0+'%'
			}];

			Morris.Donut({
				element: 'graph-donut-sdk',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		}
	});

	// error country rate donut graph
	$.ajax({
		url: '/api/statistics/project/' + urqaio.currentProject + '/country',
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
				var element = {};
				element.value =  data[i].count;
				element.label = data[i].country;
				element.formatted = ((data[i].count/total_errorcount) * 100).toFixed(1) + '%';
				chart_data.push(element);
			}

			Morris.Donut({
				element: 'graph-donut-country',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var chart_data = [{
				value: 100,
				label: 'unknown',
				formatted: 0+'%'
			}];

			Morris.Donut({
				element: 'graph-donut-country',
				data: chart_data,
				backgroundColor: '#fff',
				labelColor: '#1fb5ac',
				colors: [
					'#E67A77','#D9DD81','#79D1CF','#95D7BB'
				],
				formatter: function (x, data) { return data.formatted; }
			});
		}
	});

	// error device line graph
	$.ajax({
		url: '/api/statistics/project/' + urqaio.currentProject + '/device',
		success:function(data){
			var labels = [];
			var chart_data = [];
			for(var i = 0; i < data.length; i++){
				labels.push(data[i].device);
				chart_data.push(data[i].count);
			}

			(function(){
				var t;
				function size(animate){
					if (animate == undefined){
						animate = false;
					}
					clearTimeout(t);
					t = setTimeout(function(){
						$("canvas").each(function(i,el){
							$(el).attr({
								"width":$(el).parent().width(),
								"height":$(el).parent().outerHeight()
							});
						});
						redraw(animate);
						var m = 0;
						$(".chartJS").height("");
						$(".chartJS").each(function(i,el){ m = Math.max(m,$(el).height()); });
						$(".chartJS").height(m);
					}, 30);
				}
				$(window).on('resize', function(){ size(false); });

				function redraw(animation){
					var options = {};
					if (!animation){
						options.animation = false;
					} else {
						options.animation = true;
					}

					(function(){
						var barChartData = {
							labels: labels,
							datasets: [
								{
									fillColor: "#79d1cf",
									strokeColor: "#79d1cf",
									data: chart_data
								}
							]
						}

						var myLine = new Chart(document.getElementById("device-errorrate").getContext("2d")).Bar(barChartData);
					})();
				}
				size(true);
			}());
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var labels = [];
			var chart_data = [];

			for(var i = 0; i < 10; i++){
				labels.push('unknown');
				chart_data.push(i);
			}

			(function(){
				var t;
				function size(animate){
					if (animate == undefined){
						animate = false;
					}
					clearTimeout(t);
					t = setTimeout(function(){
						$("canvas").each(function(i,el){
							$(el).attr({
								"width":$(el).parent().width(),
								"height":$(el).parent().outerHeight()
							});
						});
						redraw(animate);
						var m = 0;
						$(".chartJS").height("");
						$(".chartJS").each(function(i,el){ m = Math.max(m,$(el).height()); });
						$(".chartJS").height(m);
					}, 30);
				}
				$(window).on('resize', function(){ size(false); });

				function redraw(animation){
					var options = {};
					if (!animation){
						options.animation = false;
					} else {
						options.animation = true;
					}

					(function(){
						var barChartData = {
							labels: labels,
							datasets: [
								{
									fillColor: "#79d1cf",
									strokeColor: "#79d1cf",
									data: chart_data
								}
							]
						}

						var myLine = new Chart(document.getElementById("device-errorrate").getContext("2d")).Bar(barChartData);
					})();
				}
				size(true);
			}());
		}
	});

   $.ajax({
		url:'/api/statistics/project/'+urqaio.currentProject+'/errorclassname',
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
				var gax='progress-bar progress-bar-danger';
				var element = {};
				element.value =  data[i].errorclassname;
				element.label = data[i].count;
				chart_data.push(element);
				data[i].rate = Math.round((data[i].count/total_errorcount)*100);
				// 색칠
				if(i==0){
				 gax='progress-bar progress-bar-danger';
				}
				else if(i==1){
					gax='progress-bar progress-bar-warning';
				}else{
				 gax='progress-bar progress-bar-info';
				}

			$( "#erate" ).append( '<div class="content-row"><p class="text-ellipsis">'+data[i].errorclassname+'</p><div><div class="progress progress-xs"><div style="width: '+data[i].rate+'%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="20" role="progressbar" class="'+gax+'"><span class="sr-only">'+data[i].rate+'% Complete</span></div></div><div>'+data[i].rate+'%</div></div></div>' );
			}
			chart_data.push(element);
		} // error 처리
	});


   $.ajax({
		url:'/api/statistics/project/'+urqaio.currentProject+'/lastactivity',async: false,
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
					var gax='progress-bar progress-bar-danger';
				var element = {};
				element.value =  data[i].lastactivity;
				data[i].rate = Math.round((data[i].count/total_errorcount)*100);
				element.label = data[i].count;

				chart_data.push(element);
				if(i==0){
				 gax='progress-bar progress-bar-danger';
				}
				else if(i==1){
					gax='progress-bar progress-bar-warning';
				}else{
				 gax='progress-bar progress-bar-info';
				}

			$( "#eact" ).append('<div class="content-row"><p class="text-ellipsis">'+data[i].lastactivity+'</p><div><div class="progress progress-xs"><div style="width: '+data[i].rate+'%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="20" role="progressbar" class="'+gax+'"><span class="sr-only">'+data[i].rate+'% Complete</span></div></div><div>'+data[i].rate+'%</div></div></div>');
			}
			chart_data.push(element);
		} // error 처리
	});

	// version error rate multi line graph
	$.ajax({
		url: '/api/statistics/project/' + urqaio.currentProject + '/error_version',
		success:function(data){
			var chart_data =[];
			for(var i = 0; i < data.length; i++){
			}

			(function(){
				var chart = c3.generate({
					bindto: '#version-chart',
					data: {
						columns: data.data,
						type: 'bar',
						groups: [
							data.osversion
						]
					},color: {
						pattern: ['#1fb5ac','#E67A77','#D9DD81','#f0ad4e','#95D7BB']
					},
					axis: {
						rotated: true,
						x: {
							tick: {
								format: function (i) { return data.appversion[i]; }
							}
						}
					}
				});
			})();
		} // error 처리
	});


	var filterData = {};

	$("#date-slider").ionRangeSlider({
		onFinish: function(data) {
			if (filterData["datestart"] !== data.fromNumber ||
				filterData["dateend"] !== data.toNumber)
			{
				filterData["datestart"] = data.fromNumber;
				filterData["dateend"] = data.toNumber;

				location.reload();
			}
		}
	});

	var updateSliderScale = null;
	$(window).resize(function(){
		clearTimeout(updateSliderScale);
		updateSliderScale = setTimeout(function(){
			$("#date-slider").ionRangeSlider('update');
		}, 100);
	});
});
