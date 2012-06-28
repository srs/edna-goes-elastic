function fetchDataToElement(query, elementId, writerFunction, page) {
     $.ajax({
        url: SEARCH_URL,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(query),
        success: function (data) {

            var resultRowsElements = $('.resultRows');
            resultRowsElements.empty();
            resultRowsElements.hide();
            writerFunction.call(window, elementId, data, page);
            resultRowsElements.fadeIn(100);
        }
    });
}

function buildSearchFilter(filterString, page, size) {

    var queryExpression;

    if (filterString === "") {
        queryExpression = '{"query" : {"match_all" : {}}}';
    } else {
        queryExpression = '{"query" : { "wildcard" : { "_all" : "' + filterString + '" }}}';
    }

    console.log(queryExpression);

    var newFrom = ( (page-1) * size) + 1;

    var queryObject = JSON.parse(queryExpression);
    queryObject.from = newFrom;
    queryObject.size = size;
    queryObject.sort = {
        "logDate": "desc"
    };

    return queryObject;
}






