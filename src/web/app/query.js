function fetchDataToElement(query, elementId, writerFunction, page) {
    $.ajax({
        url: SEARCH_URL,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(query),
        success: function (data) {

            var resultRowsElements = $('#' + elementId);
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

function buildStatsQuery(filterString, field) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);

    queryObj.facets = {};
    queryObj.facets.stat1 = {};
    queryObj.facets.stat1.statistical = {};
    queryObj.facets.stat1.statistical.field = field;
    return queryObj;
}

function buildDateFacet(filterString, field, interval) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);

    queryObj.facets = {};
    queryObj.facets.histo1 = {};
    queryObj.facets.histo1.date_histogram = {};
    queryObj.facets.histo1.date_histogram.field = field;
    queryObj.facets.histo1.date_histogram.interval = interval;
    return queryObj;
}

function buildTermFacet(filterString, field, size) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 1, 1);

    queryObj.facets = {};
    queryObj.facets.tag = {};
    queryObj.facets.tag.terms = {};
    queryObj.facets.tag.terms.field = field;
    queryObj.facets.tag.terms.size = size;
    return queryObj;
}








