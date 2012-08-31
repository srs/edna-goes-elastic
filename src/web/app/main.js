var topRobots = [];

function getFilterValue() {
    return $("#searchField").val();
}
function handleButtonEvents() {
    $("body").on("click", ".btn", function (event) {

        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");
        var currPage = button.attr("data-pagenum");

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


function handleFilterChanges() {

    $("#searchField").keyup(function (event) {

        var filterValue = getFilterValue();

        if (filterValue.length == 0 || filterValue.length >= 3) {
            delay(function () {

                var query = buildSearchFilter(filterValue, 0, RESULT_COUNT);
                fetchDataToElement(query, 'searchResult', logEntryWriter, 1);

                var statQuery = buildStatsQuery(filterValue, "hours");
                fetchDataToElement(statQuery, 'hoursStats', statsWriter, 1);

            }, 500);
        }
    });
}


$(document).bind('hoursStatsReady', function (event) {

    var filterValue = getFilterValue();
    var topGuysFacet = buildTermsStatFacet(filterValue, "resource", "hours", 3, "total");
    fetchDataToElement(topGuysFacet, 'topGuysFacet', topGuysWriter, 1);
})

$(document).bind('topGuysFacetReady', function (event) {

    for (var i = 0; i < topRobots.length; i++) {
        var filterValue = getFilterValue();
        var worklogFacet = buildWorklogFilter(filterValue, topRobots[i], "logDate", "year");
        fetchDataToElement(worklogFacet, 'worklogChart' + topRobots[i], worklogWriter, 1);
    }
})

$(document).ready(function () {

    var filterValue = $("#searchField").val();

    var query = buildSearchFilter(filterValue, 0, RESULT_COUNT);
    fetchDataToElement(query, 'searchResult', logEntryWriter, 1);

    var statQuery = buildStatsQuery(filterValue, "hours");
    fetchDataToElement(statQuery, 'hoursStats', statsWriter, 1);

    handleButtonEvents();
    handleFilterChanges();

});












