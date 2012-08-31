function getFilterValue() {
    return $("#searchField").val().toLowerCase();
}
function handleButtonEvents() {
    $("body").on("click", ".btn", function (event) {

        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");
        var currPage = button.attr("data-pagenum");
        console.log("CurrPage: " + currPage);

        var query = buildSearchFilter(getFilterValue(), currPage, RESULT_COUNT);
        fetchDataToElement(query, 'searchResult', logEntryWriter, currPage);
    });
}

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

var searchResultReady = jQuery.Event("searchResult");
var startQueryReady = jQuery.Event("statQueryReady");
var togGuyFacetReady = jQuery.Event("topGuysFacet");

function handleFilterChanges() {

    $("#searchField").keyup(function (event) {

        var filterValue = getFilterValue();

        if (filterValue.length == 0 || filterValue.length >= 3) {
            delay(function () {

                var query = buildSearchFilter(filterValue, 0, RESULT_COUNT);
                fetchDataToElement(query, 'searchResult', logEntryWriter, 1, searchResultReady);

                var statQuery = buildStatsQuery(filterValue, "hours");
                fetchDataToElement(statQuery, 'hoursStats', statsWriter, 1, startQueryReady);

            }, 200);
        }
    });
}


$(document).bind('hoursStatsReady', function (event) {

    var filterValue = getFilterValue();
    var topGuysFacet = buildTermsStatFacet(filterValue, "resource", "hours", 3, "total");
    fetchDataToElement(topGuysFacet, 'topGuysFacet', topGuysWriter, 1, togGuyFacetReady);
})

$(document).ready(function () {

    var filterValue = $("#searchField").val();

    var query = buildSearchFilter(filterValue, 0, RESULT_COUNT);
    fetchDataToElement(query, 'searchResult', logEntryWriter, 1);

    var statQuery = buildStatsQuery(filterValue, "hours");
    fetchDataToElement(statQuery, 'hoursStats', statsWriter, 1, startQueryReady);

    handleButtonEvents();
    handleFilterChanges();
});












