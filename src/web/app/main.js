function getFilterValue() {
    return $("#searchField").val().toLowerCase();
}
function handleButtonEvents() {
    $("body").on("click", ".btn", function (event) {
        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");
        var currPage = button.attr("data-pagenum");
        var query = buildSearchFilter(getFilterValue(), currPage, 5);
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

        if (filterValue.length >= 3) {
            delay(function () {
                var query = buildSearchFilter(filterValue, 1, 5);
                console.log(JSON.stringify(query));
                fetchDataToElement(query, 'east', logEntryWriter, 1);
            }, 200);
        }
    });
}

$(document).ready(function () {

    var query = buildSearchFilter($("#searchField").val(), 1, 5);

    fetchDataToElement(query, 'east', logEntryWriter, 1);
    handleButtonEvents();
    handleFilterChanges();
});












