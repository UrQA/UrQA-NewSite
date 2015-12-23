(function ($) {
    "use strict";
    $(document).ready(function () {
        /// Data Table
        var _dataTable = $('#dynamic-table').DataTable( {
            "bJQueryUI": true,
            "bStateSave": true,
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": '/api/dashboard/project/'+urqaio.currentProject+'/errors/tranding',
            "sAjaxDataProp": "errorData",
            "bUseRendered": true,
            "bLengthChange": false,
            "bSort": false,
            "bFilter": false,
            "bInfo": false,
            "aoColumnDefs":[
                {
                    "aTargets": [0, 1, 2, 3, 4],
                    "fnCreatedCell": function(nTd, sData, oData, iRow, iCol){
                        var nameList = ["Rank", "Count", "Name", "Tags", "Date"];
                        var styleList = ["text-center", "text-center", "table-text-ellipsis", "tags", "res-hidden"];
                        $(nTd).attr("data-title", nameList[iCol]).addClass(styleList[iCol]);
                        if (iCol == 0)
                        {
                            $(nTd).html('<span class=\"label label-' + sData.toLowerCase() + ' label-mini\" style=\"width:100%\">' + sData + '</span>');
                        }
                        else if (iCol == 1)
                        {
                            if (iRow == 0)
                                $(nTd).addClass("text-danger text-bold");
                        }
                        else if (iCol == 2)
                        {
                            $(nTd).html('<div>' + sData + '</div>');
                        }
                        else if (iCol == 3)
                        {
                            var sHTML = "<p>\n";
                            var oDataList = sData.split(",");
                            for (var sTag in oDataList)
                                sHTML += "<span class=\"label label-primary label-mini\">" + oDataList[sTag] + "</span>\n ";
                            sHTML += "\n</p>";
                            $(nTd).html(sHTML);
                        } else if (iCol == 4)
                        {
                            $(nTd).html('<div>' + sData + '</div>');
                        }
                    }
                }
            ],
            "fnDrawCallback":function() {
                $('div.dataTables_paginate')[0].style.display = "none";
            }
        });
        $('#btnTranding').click(function() {
            _dataTable.ajax.url('/api/dashboard/project/'+urqaio.currentProject+'/errors/tranding').load();
        });
        $('#btnLatest').click(function() {
            _dataTable.ajax.url('/api/dashboard/project/'+urqaio.currentProject+'/errors/latest').load();
        });
        $('#dynamic-table tbody').on('click', 'tr', function () {
            var data = _dataTable.row(this).data();
            location.href = '/dashboard/' + urqaio.currentProject + '/error/' + data['ID'];
        });
        if ($.fn.plot) {
            var options = {
                grid: {
                    backgroundColor: {
                        colors: ["#fff", "#fff"]
                    },
                    borderWidth: 0,
                    borderColor: "#f0f0f0",
                    margin: 0,
                    minBorderMargin: 0,
                    labelMargin: 20,
                    hoverable: true,
                    clickable: true
                },
                // Tooltip
                tooltip: true,
                tooltipOpts: {
                    content: "날짜: %x 에러 수: %y",
                    shifts: {
                        x: -60,
                        y: 25
                    },
                },
                legend: {
                    labelBoxBorderColor: "#ccc",
                    show: false,
                    noColumns: 0
                },
                series: {
                    stack: true,
                    shadowSize: 0,
                    highlightColor: 'rgba(30,120,120,.5)'
                },
                xaxis: {
                    mode : 'time',
                    type : 'timeseries',
                    timezone: "browser",
                    timeformat: "%m/%d",
                    minTickSize: [1, "day"],
                    show: true,
                    font: {
                        style: "normal",
                        color: "#666666"
                    }
                },
                yaxis: {
                    ticks: 3,
                    tickDecimals: 0,
                    min: 0,
                    show: true,
                    tickColor: "#f0f0f0",
                    font: {
                        style: "normal",
                        color: "#666666"
                    }
                },
                points: {
                    show: true,
                    radius: 2,
                    symbol: "circle"
                },
                colors: ["#87cfcb", "#48a9a7"]
            };
            $.ajax({
                url:'/api/dashboard/project/'+urqaio.currentProject+'/daily/error',
                success:function(data){
                    var d = ([{
                        label: "Too",
                        data: data.data,
                        lines: {
                            show: true,
                            fill: true,
                            lineWidth: 2,
                            fillColor: {
                                colors: ["rgba(255,255,255,.1)", "rgba(160,220,220,.8)"]
                            }
                        }
                    }]);
                    var plot = $.plot($("#daily-visit-chart"), d, options);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                }
            });
            $.ajax({
                url:'/api/dashboard/project/'+urqaio.currentProject+'/weekly/rank',
                success:function(data){
                    var check = false;
                    var dataPie = [];
                    for(var i in data){
                        check = true;
                        var obj = {};
                        obj["label"] = data[i].rank;
                        obj["data"] = data[i].count;
                        dataPie.push(obj)
                    }
                    if(!check){
                        dataPie = [{
                            label: 'No data',
                            data: 100
                        }];
                    }
                    $.plot($(".sm-pie"), dataPie, {
                        series: {
                            pie: {
                                innerRadius: 0.5,
                                show: true,
                                stroke: {
                                    width: 0.1,
                                    color: '#ffffff'
                                }
                            }

                        },
                        legend: {
                            show: true,
                            labelFormatter: function(text, series){ return text + " (" + series.percent.toFixed(2) + "%)"; },
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        },

                        colors: ["#E67A77", "#D9DD81", "#79D1CF", "#95D7BB", "#4D5360"]
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var dataPie = [{
                        label: '<i class="fa fa-exclamation-triangle"></i>',
                        data: 100
                    }];
                    $.plot($(".sm-pie"), dataPie, {
                        series: {
                            pie: {
                                innerRadius: 0.5,
                                show: true,
                                stroke: {
                                    width: 0.1,
                                    color: '#ffffff'
                                }
                            }

                        },
                        legend: {
                            show: true,
                            labelFormatter: function(text, series){ return text + " (" + series.percent.toFixed(2) + "%)"; },
                        },
                        grid: {
                            hoverable: true,
                            clickable: true
                        },

                        colors: ["#E67A77", "#D9DD81", "#79D1CF", "#95D7BB", "#4D5360"]
                    });
                }
            });
        }

        /*==Slim Scroll ==*/
        if ($.fn.slimScroll) {
            $('.event-list').slimscroll({
                height: '305px',
                wheelStep: 20
            });
            $('.conversation-list').slimscroll({
                height: '360px',
                wheelStep: 35
            });
            $('.to-do-list').slimscroll({
                height: '300px',
                wheelStep: 35
            });
        }
    });
})(jQuery);

