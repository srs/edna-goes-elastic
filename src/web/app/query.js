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
    console.log("NewFrom: " + newFrom);

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

function appendDateFacet(queryObj, field, interval) {
    queryObj.facets = {};
    queryObj.facets.histo1 = {};
    queryObj.facets.histo1.date_histogram = {};
    queryObj.facets.histo1.date_histogram.field = field;
    queryObj.facets.histo1.date_histogram.interval = interval;
}
function buildDateFacet(filterString, field, interval) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);
    appendDateFacet(queryObj, field, interval);
    return queryObj;
}

function appendTermFacet(queryObj, field, size) {
    queryObj.facets = {};
    queryObj.facets.tag = {};
    queryObj.facets.tag.terms = {};
    queryObj.facets.tag.terms.field = field;
    queryObj.facets.tag.terms.size = size;
}

function buildTermFacet(filterString, field, size) {

    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);
    appendTermFacet(queryObj, field, size);
    return queryObj;
}

function appendTermStatFacet(queryObj, key, value, size) {
    queryObj.facets = {};
    queryObj.facets.tag_term_stat = {};
    queryObj.facets.tag_term_stat.terms_stats = {};
    queryObj.facets.tag_term_stat.terms_stats.key_field = key;
    queryObj.facets.tag_term_stat.terms_stats.value_field = value;
    queryObj.facets.tag_term_stat.terms_stats.size = size;
}

function buildTermsStatFacet(filterString, key, value, size) {
    var queryObj = {};
    applyFilterQuery(queryObj, filterString);
    applySizeSettings(queryObj, 0, 0);
    appendTermStatFacet(queryObj, key, value, size);

    console.log(queryObj);

    return queryObj
}
















