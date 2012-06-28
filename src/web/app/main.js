function buildQuery(queryString, page, size) {

    var queryExpression;

    if (queryString === "") {
        queryExpression = '{"query" : {"match_all" : {}}}';
    } else {
        queryExpression = '{"query" : { "term" : { "_all" : "' + queryString + '" }}}';
    }

    console.log(queryExpression);

    var newFrom = (page * size) + 1;

    var queryObject = JSON.parse(queryExpression);
    queryObject.from = newFrom;
    queryObject.size = size;
    queryObject.sort = {
        "logDate": "desc"
    };

    return queryObject;
}

$(document).ready(function () {

    var query = buildQuery($("#searchField").val(), 1, 5);

    fetchDataToElement(query, 'east', logEntryWriter, 1);


    $("body").on("click", ".btn", function (event) {
        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");

        var currPage = button.attr("data-pagenum");

        var query = buildQuery($("#searchField").val(), currPage, 5);

        console.log(JSON.stringify(query));

        fetchDataToElement(query, 'east', logEntryWriter, currPage);

    });

    $("#searchField").keyup(function (event) {

        var queryString = $("#searchField").val();

        if (queryString.length >= 3) {
            delay(function () {
                var query = buildQuery(queryString, 0, 5);
                console.log(JSON.stringify(query));
                fetchDataToElement(query, 'east', logEntryWriter, 1);
            }, 200);
        }
    });

});

var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();












