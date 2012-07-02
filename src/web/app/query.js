function fetchDataToElement(query, elementId, writerFunction, page) {
    $.ajax({
        url: SEARCH_URL,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(query),
        success: function (data) {

            var resultRowsElements = $('#' + elementId + ' .resultRows');
            resultRowsElements.empty();
            resultRowsElements.hide();
            writerFunction.call(window, elementId, data, page);
            resultRowsElements.fadeIn(RESULT_FADEIN_MS);
        }
    });
}

function applyFilterQuery(queryObj, filterString) {

    queryObj.query = {};
    if (filterString == "") {
        queryObj.query.match_all = {};
    } else if ((filterString.indexOf("*") >= 0)) {
        queryObj.query.wildcard = {};
        queryObj.query.wildcard._all = filterString;
    } else {
        var queryFieldArray = filterString.split(" ");

        if (queryFieldArray.length > 1) {
            queryObj.query.text = {};
            queryObj.query.text._all = {};
            queryObj.query.text._all.operator = "and";
            queryObj.query.text._all.query = filterString;
        } else {
            queryObj.query.term = {};
            queryObj.query.term._all = filterString;
        }
    }
}

function applySizeSettings(queryObject, from, size) {
    queryObject.from = from;
    queryObject.size = size;
}

function applySort(queryObject, sortField) {
    queryObject.sort = {};
    queryObject.sort[sortField] = "desc";
}

function buildSearchFilter(filterString, page, size) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    var newFrom = ( (page ) * size);
    applySizeSettings(queryObj, newFrom, size);
    applySort(queryObj, "logDate");
    return queryObj;
}

function buildStatsQuery(filterString) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);

    queryObj.facets = {};
    queryObj.facets.stat1 = {};
    queryObj.facets.stat1.statistical = {};
    queryObj.facets.stat1.statistical.field = "hours";

    return queryObj;
}







