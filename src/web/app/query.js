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
            resultRowsElements.fadeIn(RESULT_FADEIN_MS);
        }
    });
}

function buildSearchFilter(filterString, page, size) {

    var queryExpression;

    if (filterString === "") {
        queryExpression = '{"query" : {"match_all" : {}}}';
    } else if (filterString.indexOf("*") >= 0) {
        queryExpression = '{"query" : { "wildcard" : { "_all" : "' + filterString + '" }}}';
    } else {

        var queryFieldArray = filterString.split(" ");

        if (queryFieldArray.length > 1) {
            queryExpression = '{ "query": { "text": { "_all": { "operator": "and", "query": "' + filterString + '" }}}}';
        } else {
            queryExpression = '{"query" : { "term" : { "_all" : "' + filterString + '" }}}';
        }
    }

    console.log(queryExpression);

    var newFrom = ( (page ) * size) + 1;

    var queryObject = JSON.parse(queryExpression);
    queryObject.from = newFrom;
    queryObject.size = size;
    queryObject.sort = {
        "logDate": "desc"
    };

    return queryObject;
}







