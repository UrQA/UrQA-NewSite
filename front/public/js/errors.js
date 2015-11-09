$(document).ready(function()
{
    filterData = {
        "rank": "",
        "datestart": 1,
        "dateend": 1,
        "status": "",
        "appversion": "",
        "osversion": "",
        "tag": "",
        "classes": ""
    };

    /** Data Table */
    var _dataTable = $('#dynamic-table').dataTable(
    {
        "bJQueryUI": true,
        "bStateSave": true,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "/api/project/"+urqaio.currentProject+"/errors",
        "sAjaxDataProp": "aaData",
        "aaSorting": [[ 1, "desc" ]],
        "bUseRendered": true,
        "bLengthChange": false,
        "bFilter": false,
        "bInfo": false,
        "aoColumnDefs":[
            {
                "aTargets": [0, 1, 2, 3, 4, 5],
                "fnCreatedCell": function(nTd, sData, oData, iRow, iCol){
                    var nameList = ["Rank", "Count", "Name", "Tags", "Status", "Date"];
                    var styleList = ["text-center", "text-center", "table-text-ellipsis", "tags", "res-hidden", "res-hidden"];
                    $(nTd).attr("data-title", nameList[iCol]).addClass(styleList[iCol]);
                    if (iCol == 0)
                    {
                        $(nTd).parent().attr('onclick', 'document.location="error-details.html?id=' + oData["ID"] + '"').css("cursor", "pointer");
                        
                        $(nTd).html('<span class=\"label label-' + sData.toLowerCase() + ' label-mini\" style=\"width:100%\">' + sData + '</span>');
                    }
                    else if (iCol == 1)
                    {
                        if (iRow == 0)
                            $(nTd).addClass("text-danger text-bold");
                    }
                    else if (iCol == 2)
                    {
                        $(nTd).html('<div>\n ' + sData + '\n </div>');
                    }
                    else if (iCol == 3)
                    {
                        sHTML = "<p>\n";
                        oDataList = sData.split(",");
                        for (sTag in oDataList)
                            sHTML += "<span class=\"label label-primary label-mini\">" + oDataList[sTag] + "</span>\n ";
                        sHTML += "\n</p>";

                        $(nTd).html(sHTML);
                    }
                    else if (iCol == 4)
                    {
                        $(nTd).html('<select data-index="' + oData["ID"] + '" class="form-control" \
                            style="width:100%;margin-top:-4px;margin-bottom:-4px">\
                            <option value="new">New</option>\
                            <option value="open">Open</option>\
                            <option value="fixed">Fixed</option>\
                            <option value="ignore">Ignore</option>\
                        </select>');
                        $(nTd).children("select").val(sData.toLowerCase());
                        $(nTd).children("select").change(function(){
                            // Ajax to server
                        });
                    }
                }
            }
        ],
        "fnServerParams": function (aoData) {
            for (prop in filterData) {
                aoData.push( { "name": prop, "value": filterData[prop] } );
            }
        },
        "aoColumns":[
            {"bSortable": true},
            {"bSortable": true},
            {"bSortable": false},
            {"bSortable": false},
            {"bSortable": true},
            {"bSortable": true}
        ],
        "oLanguage":{
            "oPaginate":{
                "sPrevious": "Prev"
            }
        }
    } );
    updateFilterData = function() {
        _dataTable.api().ajax.reload();
    };

    $('#btnTranding').click(function() { _dataTable.api().ajax.url('./test3.json').load(); } );
    $('#btnLatest').click(function() { _dataTable.api().ajax.url('./test4.json').load(); } );


    /** iCheck */
    $(function(){
        eventCheckString = 'ifCreated ifClicked ifChanged ifChecked ifUnchecked ifDisabled ifEnabled ifDestroyed check ';
        eventCheck = function(event){                
            if(event.type ==="ifChecked"){
                $(this).trigger('click');  
                $('input').iCheck('update');
            }
            if(event.type ==="ifUnchecked"){
                $(this).trigger('click');  
                $('input').iCheck('update');
            }       
            if(event.type ==="ifDisabled"){
                console.log($(this).attr('id')+'dis');  
                $('input').iCheck('update');
            }                                
        };

        $('.flat-red input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-red',
            radioClass: 'iradio_flat-red'
        });
        $('.flat-grey input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-grey',
            radioClass: 'iradio_flat-grey'
        });
        $('.flat-green input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-green'
        });
        $('.flat-blue input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
        $('.flat-yellow input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-yellow',
            radioClass: 'iradio_flat-yellow'
        });
        $('.flat-purple input').on(eventCheckString, eventCheck).iCheck({
            checkboxClass: 'icheckbox_flat-purple',
            radioClass: 'iradio_flat-purple'
        });
    });

    // Checkbox
    $(function(){
        var checkInfo = [
            {
                "type": "check",
                "keyword": "rank",
                "prefix": "check-rank-",
                "all": $("#check-rank-all")
            },
            {
                "type": "check",
                "keyword": "status",
                "prefix": "check-status-",
                "all": $("#check-status-all")
            },
            {
                "type": "check",
                "keyword": "appversion",
                "prefix": "check-app-",
                "all": $("#check-app-all"),
                "selectbox": $("#select-app"),
                "filterString": function(obj) {
                    return obj.attr("id").split("-")[obj.attr("id").split("-").length - 1].split("_").join(".");
                }
            },
            {
                "type": "check",
                "keyword": "osversion",
                "prefix": "check-os-",
                "all": $("#check-os-all"),
                "selectbox": $("#select-os"),
                "filterString": function(obj) {
                    return obj.attr("id").split("-")[obj.attr("id").split("-").length - 1].split("_").join(".");
                }
            },
            {
                "type": "tags",
                "keyword": "country",
                "taglist": $("#countrysearch")
            },
            {
                "type": "tags",
                "keyword": "classes",
                "taglist": $("#classsearch")
            }
        ];

        reloadFilterData = function() {
            for (var i in checkInfo)
            {
                var info = checkInfo[i];

                if (checkInfo[i]["type"] === "check")
                {
                    var index = 0;

                    filterData[info["keyword"]] = "";
                    for (var j in info["list"])
                    {
                        var checkbox = info["list"][j];
                        if (checkbox.prop("checked"))
                        {
                            filterData[info["keyword"]] += info["filterString"](checkbox) + ",";
                            index ++;
                        }
                    }
                    // All Checked
                    if (index >= info["list"].length)
                        filterData[info["keyword"]] = "all";
                }
                else if (checkInfo[i]["type"] === "tags")
                {
                    filterData[info["keyword"]] = "";
                    checkInfo[i]["taglist"].children("span.tags").filter(function() {
                        filterData[info["keyword"]] += info["filterString"]($(this)) + ",";
                    });
                }
            }

            updateFilterData();
        };
        selectboxChange = function(){
            if ($(this).val() === "Select")
                return;

            // Add Checkbox
            var index = $(this).attr("data-index");
            var obj = $(this).children("option:selected");
            var IDName = checkInfo[index]["prefix"] + obj.val().split(".").join("_");
            $(this).before("<div class=\"flat-green\" style=\"white-space:nowrap;overflow:hidden\">\n\
                <div class=\"radio\">\n\
                    <input id=\"" + IDName + "\" type=\"checkbox\" checked>\n\
                    <label>" + obj.val() + "</label>\n\
                </div>\n\
            </div>");

            // Add Checkbox Event
            $("#" + IDName).on('ifCreated ifClicked ifChanged ifChecked ifUnchecked ifDisabled ifEnabled ifDestroyed check ', function(event){                
                if(event.type ==="ifChecked"){
                    $(this).trigger('click');  
                    $('input').iCheck('update');
                }
                if(event.type ==="ifUnchecked"){
                    $(this).trigger('click');  
                    $('input').iCheck('update');
                }       
                if(event.type ==="ifDisabled"){
                    console.log($(this).attr('id')+'dis');  
                    $('input').iCheck('update');
                }                                
            }).iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            }).click(checkboxCheck).attr("data-index", index);
            checkInfo[index]["list"][checkInfo[index]["list"].length] = $("#" + IDName);

            // Checkbox Animation
            var newObj = $(this).prev();
            var lastWidth = newObj.width();
            newObj.css("width", 0);
            setTimeout(function(){
                newObj.css("transition", "width 0.35s").css("-moz-transition", "width 0.35s").css("-webkit-transition", "width 0.35s").css("width", lastWidth);
                setTimeout(function(){
                    newObj.css("width", "").css("white-space", "").css("overflow", "").css("transition", "").css("-moz-transition", "").css("-webkit-transition", "");
                }, 350);
            }, 50);

            // SelectBox
            $(this).val("Select");
            obj.remove();

            // Request Data
            if (filterData[checkInfo[index]["keyword"]] !== "all")
                filterData[checkInfo[index]["keyword"]] += checkInfo[index]["filterString"]($("#" + IDName)) + ',';
            updateFilterData();
        };
        checkboxCheck = function() {
            var obj = $(this);
            var index = obj.attr("data-index");

            var checkCount = 0;
            var info = checkInfo[index];

            filterData[info["keyword"]] = "";
            for (var i in info["list"])
            {
                var checkbox = info["list"][i];
                if (checkbox[0] != obj[0] && checkbox.prop("checked"))
                {
                    checkCount ++;
                    filterData[info["keyword"]] += info["filterString"](checkbox) + ",";
                }
            }
            if (obj.prop("checked") == false)
            {
                checkCount ++;
                filterData[info["keyword"]] += info["filterString"](obj) + ",";
            }

            if (checkCount == info["list"].length)
            {
                info["all"].prop("checked", true);
                filterData[info["keyword"]] = "all";
            }
            else
                info["all"].prop("checked", false);

            updateFilterData();
        };
        checkAll = function() {
            var obj = $(this);
            var index = obj.attr("data-index");

            var info = checkInfo[index];

            if (obj.prop("checked") == false)
            {
                for (var i in info["list"])
                    info["list"][i].prop("checked", true);

                filterData[info["keyword"]] = "all";
            }
            else
            {
                for (var i in info["list"])
                    info["list"][i].prop("checked", false);

                filterData[info["keyword"]] = "";
            }
            updateFilterData();
        };
        tagClick = function() {
            var index = $(this).parent().attr("data-index");
            var nameValue = $(this).children("span").text();

            // Request Data
            filterData[checkInfo[index]["keyword"]] = filterData[checkInfo[index]["keyword"]].split(nameValue + ",").join("");
            updateFilterData();

            // Tag Animation
            $(this).parent().children("select").append(new Option(nameValue, nameValue));
            $(this).css("white-space", "nowrap").css("overflow", "hidden").animate({
                width: 0
            }, 350, function() {
                $(this).remove();
            });
        };
        tagSelectboxChange = function() {
            if ($(this).val() === "Select")
                return;

            // Add Checkbox
            var index = $(this).parent().attr("data-index");
            var obj = $(this).children("option:selected");
            $(this).before("<span class=\"tags\" style=\"white-space:nowrap;overflow:hidden\">\n\
                <span>" + obj.val() + "</span>\n\
                <a>x</a>\n\
            </span>");
            $(this).prev().click(tagClick);

            // Tag Animation
            var newObj = $(this).prev();
            var lastWidth = newObj.width();
            newObj.css("width", 0);
            setTimeout(function(){
                newObj.css("transition", "width 0.35s").css("-moz-transition", "width 0.35s").css("-webkit-transition", "width 0.35s").css("width", lastWidth);
                setTimeout(function(){
                    newObj.css("width", "").css("white-space", "").css("overflow", "").css("transition", "").css("-moz-transition", "").css("-webkit-transition", "");
                }, 350);
            }, 50);

            // SelectBox
            $(this).val("Select");
            obj.remove();

            // Request Data
            filterData[checkInfo[index]["keyword"]] += checkInfo[index]["filterString"]($(this).prev()) + ',';
            updateFilterData();
        };

        // Initialize
        for (var i in checkInfo)
        {
            if (checkInfo[i]["type"] === "check")
            {
                // Checkbox
                if (checkInfo[i]["info"] !== undefined)
                {
                    for (var j in checkList[i])
                        checkList[i][j].click(checkboxCheck).attr("data-index", i);
                }
                else
                {
                    var j = 0;
                    checkInfo[i].list = [];
                    $("[id^=" + checkInfo[i]["prefix"] + "]").each(function(){
                        if ($(this)[0] != checkInfo[i]["all"][0])
                        {
                            $(this).click(checkboxCheck).attr("data-index", i);
                            checkInfo[i].list[j++] = $(this);
                        }
                    });
                }

                // Filtering String
                if (checkInfo[i]["filterString"] === undefined)
                {
                    checkInfo[i]["filterString"] = function(o) {
                        return o.attr("id").split("-")[o.attr("id").split("-").length-1];
                    };
                }

                // SelectBox
                if (checkInfo[i]["selectbox"] !== undefined)
                {
                    checkInfo[i]["selectbox"].attr("data-index", i);
                    checkInfo[i]["selectbox"].change(selectboxChange);
                }

                // Check All
                checkInfo[i]["all"].click(checkAll);
                checkInfo[i]["all"].attr("data-index", i);
            }
            else if (checkInfo[i]["type"] === "tags")
            {
                // SelectBox
                checkInfo[i]["taglist"].children("select").change(tagSelectboxChange);

                // Tags
                checkInfo[i]["taglist"].children("span.tags").filter(function() {
                    $(this).click(tagClick);
                });

                // Filtering String
                if (checkInfo[i]["filterString"] === undefined)
                {
                    checkInfo[i]["filterString"] = function(obj) {
                        return obj.children("span").text();
                    }
                }

                checkInfo[i]["taglist"].attr("data-index", i);
            }
        }
        reloadFilterData();
    });

    /** Tagsearch */
    

    /** Iron Range Slider */
    $("#date-slider").ionRangeSlider({
        onFinish: function(data) {
            if (filterData["datestart"] !== data.fromNumber ||
                filterData["dateend"] !== data.toNumber)
            {
                filterData["datestart"] = data.fromNumber;
                filterData["dateend"] = data.toNumber;

                updateFilterData();
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
    $('.panel .tools .fa').click(function () {
        clearTimeout(updateSliderScale);
        updateSliderScale = setTimeout(function(){
            $("#date-slider").ionRangeSlider('update');
        }, 100);
    });
});
