function getFilterValue() {
    return $("#searchField").val().toLowerCase();
}
function handleButtonEvents() {
    $("body").on("click", ".btn-mini", function (event) {
        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");
        var currPage = button.attr("data-pagenum");
        console.log("CurrPage: " + currPage );

        var query = buildSearchFilter(getFilterValue(), currPage, RESULT_COUNT);
        fetchDataToElement(query, 'east', logEntryWriter, currPage);
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
                console.log(JSON.stringify(query));
                fetchDataToElement(query, 'east', logEntryWriter, 1);

                var statQuery = buildStatsQuery(filterValue);
                fetchDataToElement(statQuery, 'west', statsWriter, 1);
            }, 200);
        }
    });
}

$(document).ready(function () {

    var filterValue = $("#searchField").val();
    var query = buildSearchFilter(filterValue, 0, RESULT_COUNT);
    fetchDataToElement(query, 'east', logEntryWriter, 1);

    var statQuery = buildStatsQuery(filterValue);
    fetchDataToElement(statQuery, 'west', statsWriter, 1);

    handleButtonEvents();
    handleFilterChanges();
});












