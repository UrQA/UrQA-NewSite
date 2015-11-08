(function ($) {
    "use strict";
    $(document).ready(function () {
        /// Data Table
        var _dataTable = $('#dynamic-table').dataTable( {
            "bJQueryUI": true,
            "bStateSave": true,
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": urqaio.baseUrl + "/ajax/sample1",
            "sAjaxDataProp": "aaData",
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
                        }
                    }
                }
            ],
            "fnDrawCallback":function() {
                $('div.dataTables_paginate')[0].style.display = "none";
            }
        } );

        $('#btnTranding').click(function() {
            _dataTable.api().ajax.url(urqaio.baseUrl + "/ajax/sample2").load();
        } );
        $('#btnLatest').click(function() {
            _dataTable.api().ajax.url(urqaio.baseUrl + "/ajax/sample1").load();
        } );
        //////////////////////////

        if ($.fn.plot) {

            var d1 = [
                [0, 10],
                [1, 20],
                [2, 33],
                [3, 24],
                [4, 45],
                [5, 96],
                [6, 47],
                [7, 18],
                [8, 11],
                [9, 13],
                [10, 21]

            ];
            var data = ([{
                label: "Too",
                data: d1,
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    fillColor: {
                        colors: ["rgba(255,255,255,.1)", "rgba(160,220,220,.8)"]
                    }
                }
            }]);
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
                    content: "%s X: %x Y: %y",
                    shifts: {
                        x: -60,
                        y: 25
                    },
                    defaultTheme: false
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
                    tickLength: 0,
                    tickDecimals: 0,
                    show: true,
                    min: 2,

                    font: {

                        style: "normal",


                        color: "#666666"
                    }
                },
                yaxis: {
                    ticks: 3,
                    tickDecimals: 0,
                    show: true,
                    tickColor: "#f0f0f0",
                    font: {

                        style: "normal",


                        color: "#666666"
                    }
                },
                //        lines: {
                //            show: true,
                //            fill: true
                //
                //        },
                points: {
                    show: true,
                    radius: 2,
                    symbol: "circle"
                },
                colors: ["#87cfcb", "#48a9a7"]
            };
            var plot = $.plot($("#daily-visit-chart"), data, options);



            // DONUT
            var dataPie = [{
                label: "Unhandle",
                data: 4.59
            },
            {
                label: "Critical",
                data: 40.81
            },
            {
                label: "Major",
                data: 13.21
            },
            {
                label: "Minor",
                data: 16.24
            },
            {
                label: "Native",
                data: 20.43
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
                    /*sorted: function(a, b){
                        var a_var = parseFloat(a.label.split(" (")[1].split("%)")[0]);
                        var b_var = parseFloat(b.label.split(" (")[1].split("%)")[0]);

                        return a_var == b_var ? 0 : (a_var < b_var ? 1 : -1);
                    }*/
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },

                colors: ["#E67A77", "#D9DD81", "#79D1CF", "#95D7BB", "#4D5360"]
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

