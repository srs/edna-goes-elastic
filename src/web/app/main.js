function buildQuery(queryString, page, size) {

    var newFrom = (page * size) + 1;

    var queryObject = JSON.parse(queryString);
    queryObject.from = newFrom;
    queryObject.size = size;
    queryObject.sort = {
        "logDate" : "desc"
    };

    return queryObject;
}

$(document).ready(function () {

    var query = buildQuery('{ "query": { "match_all": {} }}', 0, 3);

    fetchDataToElement(query, 'east', logEntryWriter, 1);


    $("body").on("click", ".btn", function (event) {
        var button = $(event.currentTarget);
        $('.btn').removeClass("active");
        button.addClass("active");

        var currPage = button.attr("data-pagenum");

        var query = buildQuery('{ "query": { "match_all": {} }}', currPage, 3);

        console.log(JSON.stringify(query));

        fetchDataToElement(query, 'east', logEntryWriter, currPage);

    });

});










