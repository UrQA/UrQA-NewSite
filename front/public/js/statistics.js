$(document).ready(function()
{

	$.ajax({
		url:'https://honeyqa.io:8080/',
		success:function(data){
			$('#time').append(data);
		}
	});

	/* Bar Graph 현재 사용 안함
	Morris.Bar({
	    element: 'dau-bar',
	    data: [
	        {x: '11/01', y: 3, z: 2, a: 3, b: 5, c: null},
	        {x: '11/02', y: 2, z: null, a: 1, b: 5, c: null},
			{x: '11/02', y: 2, z: null, a: 1, b: 5, c: null},
			{x: '11/02', y: 2, z: null, a: 1, b: 5, c: null}
	    ],
	    xkey: 'x',
	    ykeys: ['y', 'z', 'a', 'b', 'c'],
	    labels: ['Y', 'Z', 'A', 'B', 'C'],
	    barColors:['#E67A77','#D9DD81','#79D1CF','#79D1CF','#79D1CF']
	});
	*/


	var day_data = [
	    {"elapsed": "11/01", "value": 34},
	    {"elapsed": "11/02", "value": 24},
	    {"elapsed": "11/03", "value": 3},
	    {"elapsed": "11/04", "value": 12},
	    {"elapsed": "11/05", "value": 13},
	    {"elapsed": "11/06", "value": 22},
	    {"elapsed": "11/07", "value": 5}
	];
	Morris.Area({
	    element: 'crash-rate',
	    data: day_data,
	    xkey: 'elapsed',
	    ykeys: ['value'],
	    labels: ['value'],
	    lineColors:['#79D1CF'],
	    parseTime: false
	});

	Morris.Donut({
		element: 'graph-donut-rank',
		data: [
			{value: 17.6, label: 'com.android.volley.toolbox.d', formatted: '17.6%' },
			{value: 13.7, label: 'at droom.sleepIfUCan.activity.af (:211)', formatted: '13.7%' },
			{value: 11, label: 'droom.sleepIfUCan.activity.af', formatted: '11%' },
			{value: 8.7, label: 'android.database.sqlite.SQLiteStatement', formatted: '8.7%' },
			{value: 8.5, label: 'android.content.res.Resources', formatted: '8.5%' },
			{value: 5.3, label: 'android.os.BinderProxy', formatted: '5.3%' },
			{value: 4.5, label: 'at android.widget.NumberPicker$ChangeCurrentByOneFromLongPressCommand', formatted: '4.5%' },
			{value: 4.3, label: 'at android.content.res.Resources', formatted: '4.3%' },
			{value: 4, label: 'android.database.sqlite.SQLiteStatement', formatted: '4%' },
			{value: 2, label: 'android.database.sqlite.SQLiteConnection', formatted: '2%' },
			{value: 1.6, label: 'droom.sleepIfUCan.activity.SelectPictureActivity', formatted: '1.6%' },
			{value: 18.8, label: 'Others', formatted: '18.8%' },
		],
		backgroundColor: '#fff',
		labelColor: '#1fb5ac',
		colors: [
			'#E67A77','#D9DD81','#79D1CF','#95D7BB'
		],
		formatter: function (x, data) { return data.formatted; }
	});

	Morris.Donut({
		element: 'graph-donut-sdk',
		data: [
			{value: 17.6, label: 'com.android.volley.toolbox.d', formatted: '17.6%' },
			{value: 13.7, label: 'at droom.sleepIfUCan.activity.af (:211)', formatted: '13.7%' },
			{value: 11, label: 'droom.sleepIfUCan.activity.af', formatted: '11%' },
			{value: 8.7, label: 'android.database.sqlite.SQLiteStatement', formatted: '8.7%' },
			{value: 8.5, label: 'android.content.res.Resources', formatted: '8.5%' },
			{value: 5.3, label: 'android.os.BinderProxy', formatted: '5.3%' },
			{value: 4.5, label: 'at android.widget.NumberPicker$ChangeCurrentByOneFromLongPressCommand', formatted: '4.5%' },
			{value: 4.3, label: 'at android.content.res.Resources', formatted: '4.3%' },
			{value: 4, label: 'android.database.sqlite.SQLiteStatement', formatted: '4%' },
			{value: 2, label: 'android.database.sqlite.SQLiteConnection', formatted: '2%' },
			{value: 1.6, label: 'droom.sleepIfUCan.activity.SelectPictureActivity', formatted: '1.6%' },
			{value: 18.8, label: 'Others', formatted: '18.8%' },
		],
		backgroundColor: '#fff',
		labelColor: '#1fb5ac',
		colors: [
			'#E67A77','#D9DD81','#79D1CF','#95D7BB'
		],
		formatter: function (x, data) { return data.formatted; }
	});

	Morris.Donut({
		element: 'graph-donut-country',
		data: [
			{value: 17.6, label: 'com.android.volley.toolbox.d', formatted: '17.6%' },
			{value: 13.7, label: 'at droom.sleepIfUCan.activity.af (:211)', formatted: '13.7%' },
			{value: 11, label: 'droom.sleepIfUCan.activity.af', formatted: '11%' },
			{value: 8.7, label: 'android.database.sqlite.SQLiteStatement', formatted: '8.7%' },
			{value: 8.5, label: 'android.content.res.Resources', formatted: '8.5%' },
			{value: 5.3, label: 'android.os.BinderProxy', formatted: '5.3%' },
			{value: 4.5, label: 'at android.widget.NumberPicker$ChangeCurrentByOneFromLongPressCommand', formatted: '4.5%' },
			{value: 4.3, label: 'at android.content.res.Resources', formatted: '4.3%' },
			{value: 4, label: 'android.database.sqlite.SQLiteStatement', formatted: '4%' },
			{value: 2, label: 'android.database.sqlite.SQLiteConnection', formatted: '2%' },
			{value: 1.6, label: 'droom.sleepIfUCan.activity.SelectPictureActivity', formatted: '1.6%' },
			{value: 18.8, label: 'Others', formatted: '18.8%' },
		],
		backgroundColor: '#fff',
		labelColor: '#1fb5ac',
		colors: [
			'#E67A77','#D9DD81','#79D1CF','#95D7BB'
		],
		formatter: function (x, data) { return data.formatted; }
	});



	/* country 사용 안함
	var world_data = {
	    "af":"16.63",
	    "al":"11.58",
	    "dz":"158.97",
	    "ao":"85.81",
	    "ag":"1.1",
	    "ar":"351.02",
	    "am":"8.83",
	    "au":"1219.72",
	    "at":"366.26",
	    "az":"52.17",
	    "bs":"7.54",
	    "bh":"21.73",
	    "bd":"105.4",
	    "bb":"3.96",
	    "by":"52.89",
	    "be":"461.33",
	    "bz":"1.43",
	    "bj":"6.49",
	    "bt":"1.4",
	    "bo":"19.18",
	    "ba":"16.2",
	    "bw":"12.5",
	    "br":"2023.53",
	    "bn":"11.96",
	    "bg":"44.84",
	    "bf":"8.67",
	    "bi":"1.47",
	    "kh":"11.36",
	    "cm":"21.88",
	    "ca":"1563.66",
	    "cv":"1.57",
	    "cf":"2.11",
	    "td":"7.59",
	    "cl":"199.18",
	    "cn":"5745.13",
	    "co":"283.11",
	    "km":"0.56",
	    "cd":"12.6",
	    "cg":"11.88",
	    "cr":"35.02",
	    "ci":"22.38",
	    "hr":"59.92",
	    "cy":"22.75",
	    "cz":"195.23",
	    "dk":"304.56",
	    "dj":"1.14",
	    "dm":"0.38",
	    "do":"50.87",
	    "ec":"61.49",
	    "eg":"216.83",
	    "sv":"21.8",
	    "gq":"14.55",
	    "er":"2.25",
	    "ee":"19.22",
	    "et":"30.94",
	    "fj":"3.15",
	    "fi":"231.98",
	    "fr":"2555.44",
	    "ga":"12.56",
	    "gm":"1.04",
	    "ge":"11.23",
	    "de":"3305.9",
	    "gh":"18.06",
	    "gr":"305.01",
	    "gd":"0.65",
	    "gt":"40.77",
	    "gn":"4.34",
	    "gw":"0.83",
	    "gy":"2.2",
	    "ht":"6.5",
	    "hn":"15.34",
	    "hk":"226.49",
	    "hu":"132.28",
	    "is":"12.77",
	    "in":"1430.02",
	    "id":"695.06",
	    "ir":"337.9",
	    "iq":"84.14",
	    "ie":"204.14",
	    "il":"201.25",
	    "it":"2036.69",
	    "jm":"13.74",
	    "jp":"5390.9",
	    "jo":"27.13",
	    "kz":"129.76",
	    "ke":"32.42",
	    "ki":"0.15",
	    "kr":"986.26",
	    "kw":"117.32",
	    "kg":"4.44",
	    "la":"6.34",
	    "lv":"23.39",
	    "lb":"39.15",
	    "ls":"1.8",
	    "lr":"0.98",
	    "ly":"77.91",
	    "lt":"35.73",
	    "lu":"52.43",
	    "mk":"9.58",
	    "mg":"8.33",
	    "mw":"5.04",
	    "my":"218.95",
	    "mv":"1.43",
	    "ml":"9.08",
	    "mt":"7.8",
	    "mr":"3.49",
	    "mu":"9.43",
	    "mx":"1004.04",
	    "md":"5.36",
	    "mn":"5.81",
	    "me":"3.88",
	    "ma":"91.7",
	    "mz":"10.21",
	    "mm":"35.65",
	    "na":"11.45",
	    "np":"15.11",
	    "nl":"770.31",
	    "nz":"138",
	    "ni":"6.38",
	    "ne":"5.6",
	    "ng":"206.66",
	    "no":"413.51",
	    "om":"53.78",
	    "pk":"174.79",
	    "pa":"27.2",
	    "pg":"8.81",
	    "py":"17.17",
	    "pe":"153.55",
	    "ph":"189.06",
	    "pl":"438.88",
	    "pt":"223.7",
	    "qa":"126.52",
	    "ro":"158.39",
	    "ru":"1476.91",
	    "rw":"5.69",
	    "ws":"0.55",
	    "st":"0.19",
	    "sa":"434.44",
	    "sn":"12.66",
	    "rs":"38.92",
	    "sc":"0.92",
	    "sl":"1.9",
	    "sg":"217.38",
	    "sk":"86.26",
	    "si":"46.44",
	    "sb":"0.67",
	    "za":"354.41",
	    "es":"1374.78",
	    "lk":"48.24",
	    "kn":"0.56",
	    "lc":"1",
	    "vc":"0.58",
	    "sd":"65.93",
	    "sr":"3.3",
	    "sz":"3.17",
	    "se":"444.59",
	    "ch":"522.44",
	    "sy":"59.63",
	    "tw":"426.98",
	    "tj":"5.58",
	    "tz":"22.43",
	    "th":"312.61",
	    "tl":"0.62",
	    "tg":"3.07",
	    "to":"0.3",
	    "tt":"21.2",
	    "tn":"43.86",
	    "tr":"729.05",
	    "tm":0,
	    "ug":"17.12",
	    "ua":"136.56",
	    "ae":"239.65",
	    "gb":"2258.57",
	    "us":"14624.18",
	    "uy":"40.71",
	    "uz":"37.72",
	    "vu":"0.72",
	    "ve":"285.21",
	    "vn":"101.99",
	    "ye":"30.02",
	    "zm":"15.69",
	    "zw":"5.57"
	};
	*/

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

			/* country 사용 안함
	        (function(){
	        	var okeys = [];
		        var ovalues = [];
				for (var key in world_data)
				{
				    okeys.push(key.toUpperCase());
				    ovalues.push(parseFloat(world_data[key]));
				}
				for (var i = 0; i < ovalues.length; i ++)
				{
					for (var j = i + 1; j < ovalues.length; j ++)
					{
						if (ovalues[i] < ovalues[j])
						{
							var tmp = ovalues[i];
							ovalues[i] = ovalues[j];
							ovalues[j] = tmp;

							tmp = okeys[i];
							okeys[i] = okeys[j];
							okeys[j] = tmp;
						}
					}
				}
				var keys = [];
				var values = [];
				var other_value = 0.0;
				for (var i = 0; i < ovalues.length; i ++)
				{
					if (i < 15)
					{
						keys.push(okeys[i]);
						values.push(ovalues[i]);
					}
					else
					{
						other_value += ovalues[i];
					}
				}
				keys.push("Others");
				values.push(other_value);

		        var barChartData = {
		            labels: keys,
		            datasets: [
		                {
		                    fillColor: "#E67A77",
		                    strokeColor: "#E67A77",
		                    data: values
		                }
		            ]
		        }
		        var myLine = new Chart(document.getElementById("world_vmap_info").getContext("2d")).Bar(barChartData);
	        })();
	        */

	        (function(){
	        	var barChartData = {
		            labels: ["MI 2A", "GT-N7100", "D6503", "GT-I9192", "GT-I9300", "Lenovo S820", "SHW-M250L", "SM-G900P", "ASUS_T00F", "C1504", "D5503", "DROID RAZR HD", "ETOOSPAD", "GT-I9500", "GT-I9505", "HUAWEI T8951", "HUAWEI Y511-U30", "IM-A850K", "IM-A870S", "Lenovo A590", "Lenovo A658t", "Lenovo K910", "LG-E400", "LG-F340L", "LG-V507L", "LT22i", "sdk", "SHV-E370K", "SM-N750S", "SM-N9005", "SM-N900S", "SO-01F", "vivo X510t"],
		            datasets: [
		                {
		                    fillColor: "#79d1cf",
		                    strokeColor: "#79d1cf",
		                    data: [6,4,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		                }
		            ]
		        }

	        	var myLine = new Chart(document.getElementById("device-errorrate").getContext("2d")).Bar(barChartData);
	        })();
	    }
	    size(true);
	}());





	(function(){
		var chart = c3.generate({
		    bindto: '#version-chart',
		    data: {
		        columns: [
		            ['data1', 30, 20, 50, 40, 60, 50],
		            ['data2', 200, 130, 90, 240, 130, 220],
		            ['data3', 300, 200, 160, 400, 250, 250],
		            ['data4', 200, 130, 90, 240, 130, 220],
		            ['data5', 130, 120, 150, 140, 160, 150]
		        ],
		        types: {
		            data1: 'bar',
		            data2: 'bar',
		            data3: 'bar',
		            data4: 'bar',
		            data5: 'bar'
		        },
		        groups: [
		            ['data1','data2', 'data3', 'data4', 'data5']
		        ]
		    },color: {
				pattern: ['#1fb5ac','#E67A77','#D9DD81','#f0ad4e','#95D7BB']
			},
		    axis: {
		        rotated: true,
		        x: {
		            type: 'categorized'
		        }
		    }
		});
	})();

	// (function(){
	// 	var chart = c3.generate({
	// 	    bindto: '#device-errorrate',
	// 	    data: {
	// 	        columns: [
	// 	            ['device1', 30],
	// 	            ['device2', 40],
	// 	            ['device3', 60]
	// 	        ]
	// 	    },
	// 	    axis: {
	// 	        rotated: true,
	// 	        x: {
	// 	            type: 'categorized'
	// 	        }
	// 	    }
	// 	});
	// })();
});
