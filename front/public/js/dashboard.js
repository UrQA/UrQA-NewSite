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

