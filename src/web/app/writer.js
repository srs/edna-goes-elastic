function writeLogEntryElements(writeElementId, logEntryElement) {
    var logEntrySource = logEntryElement._source;
    $("#" + writeElementId).append('<div class="row result">' +
                                   '<h4><a href="#">' + logEntrySource.description + '</a></h4>' +
                                   '<div>' + logEntrySource.customer + ' - ' + logEntrySource.project + '</div>' +
                                   '<div>' +
                                   '<span class="label label-resource">' + logEntrySource.resource + '</span>' + '&nbsp;' +
                                   '<span class="badge badge-error">' + logEntrySource.logDate + '</span>&nbsp;' +
                                   '<span class="badge badge-success">' + logEntrySource.hours + '</span>' + '&nbsp;' +
                                   '</div>' +
                                   '</div>');
}


function getNumberOfPagesNeeded(total, resultSize) {

    console.log("Total: " + total + ", size: " + resultSize);

    var numberOfPages = Math.ceil(total / resultSize) - 1;
    return numberOfPages;
}

function logEntryPagerWriter(writeElementId, data, currentPage) {

    console.log(currentPage);

    var total = data.hits.total;
    var resultSize = data.hits.hits.length;

    if (resultSize == 0) {
        return;
    }

    var pageButtonsElement = $("#mainPager");
    pageButtonsElement.empty();

    var numberOfPagesNeeded = getNumberOfPagesNeeded(total, RESULT_COUNT);

    var doAddPagination = pageButtonsElement.length > 0 && numberOfPagesNeeded > 1;
    if (doAddPagination) {

        var numberOfPagesToShow = numberOfPagesNeeded;
        var activateNextButton = false;
        var activatePreviousButton = false;

        if (currentPage > 1) {
            activatePreviousButton = true;
        }

        if (numberOfPagesNeeded > PAGER_MAX_PAGES) {
            numberOfPagesToShow = PAGER_MAX_PAGES;
        }

        var rangeStart;
        var rangeEnd;

        var pageOffsetFromCurrent = (numberOfPagesToShow / 2);
        var startAtBeginning = parseInt(currentPage) - parseInt(pageOffsetFromCurrent) <= 0;
        var endAtNumberOfPagesNeeded = parseInt(currentPage) + parseInt(pageOffsetFromCurrent) >= parseInt(numberOfPagesNeeded);

        console.log("pageOffFromCurr: " + pageOffsetFromCurrent + ", startAtBegin: " + startAtBeginning + ", endAtNumb: " +
                    endAtNumberOfPagesNeeded);

        console.log("numberOfPagesNeeded: " + numberOfPagesNeeded + ", numberOfPagesToShow: " + numberOfPagesToShow);

        if (startAtBeginning) {
            console.log("in startAt");
            rangeStart = 1;
            rangeEnd = PAGER_MAX_PAGES;
        } else if (endAtNumberOfPagesNeeded) {
            console.log("in endAtNumber");
            rangeStart = parseInt(numberOfPagesNeeded) - parseInt(numberOfPagesToShow);
            rangeEnd = numberOfPagesNeeded;
        } else {
            console.log("in else");
            rangeStart = parseInt(currentPage) - parseInt(pageOffsetFromCurrent) + 1;
            rangeEnd = parseInt(currentPage) + parseInt(pageOffsetFromCurrent) - 1;
        }

        console.log("start: " + rangeStart + ", rangeEnd: " + rangeEnd);

        if (currentPage <= rangeEnd) {
            activateNextButton = true;
        }

        if (activatePreviousButton) {
            pageButtonsElement.append('<button class="btn btn-mini">&larr; Previous</button>');
        } else {
            pageButtonsElement.append('<button class="btn btn-mini disabled">&larr; Previous</button>');
        }

        var addFirstPage = parseInt(rangeStart) > 1;

        if (addFirstPage) {
            pageButtonsElement.append('<button class="btn btn-mini" data-pagenum="' + 1 + '">' + 1 + '....</button>');
        }

        for (var i = rangeStart; i <= rangeEnd; i++) {

            if (i == currentPage) {
                pageButtonsElement.append('<button class="btn btn-mini active" data-toggle="button">' + i + '</button>');
            } else {
                pageButtonsElement.append(createLinkToPage(i));
            }
        }

        var addLastPage = parseInt(rangeEnd) < parseInt(numberOfPagesNeeded);
        if (addLastPage) {
            pageButtonsElement.append('<button class="btn btn-mini" data-pagenum="' + parseInt(numberOfPagesNeeded) + '">....' +
                                      parseInt(numberOfPagesNeeded) +
                                      '</button>');
        }

        if (activateNextButton) {
            pageButtonsElement.append('<button class="btn btn-mini">' + 'Next &rarr;' + '</button>');
        } else {
            pageButtonsElement.append('<button class="btn btn-mini disabled">' + 'Next &rarr;' + '</button>');
        }

    }

}

function createLinkToPage(pageNum) {
    return '<button class="btn btn-mini" data-pagenum="' + pageNum + '">' + pageNum + '</button>';
}

function logEntryWriter(writeElementId, data, page) {

    console.log(data);

    if (data.hits.hits.length == 0) {

        $("#" + writeElementId).empty();
        $("#mainPager").empty();
        $("#" + writeElementId).append('<h3>No hits</h3>')
    }
    else {

        $.each(data.hits.hits, function (index, logEntry) {
            writeLogEntryElements(writeElementId, logEntry)
        });

        logEntryPagerWriter(writeElementId, data, page);
    }
}

function statsWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    console.log(data.facets.stat1);

    resultRows.append("<h4>Hours:</h4> ");
    resultRows.append("<h5>hits: " + data.facets.stat1.count + "</h5> ");
    resultRows.append("<h5>sum: " + Math.round(data.facets.stat1.total) + "</h5> ");
    resultRows.append("<h5>avg: " + Math.round(data.facets.stat1.mean) + "</h5> ");
    resultRows.append("<h5>min: " + Math.round(data.facets.stat1.min) + "</h5> ");
    resultRows.append("<h5>max: " + Math.round(data.facets.stat1.max) + "</h5> ");
}


function termFacetWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    console.log(data.facets.tag);

     resultRows.append("<h4>Customers:</h4> ");

     $.each(data.facets.tag.terms, function (index, facetEntry) {

     console.log(facetEntry);
     resultRows.append("<h5>" + facetEntry.term + " (" + facetEntry.count + ")</h5> ");
     });

}


function dateHistogramWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    console.log(data.facets.histo1);

    resultRows.append("<h4>Date histogram:</h4> ");

    $.each(data.facets.histo1.entries, function (index, histogramEntry) {
        var date = new Date(histogramEntry.time);
        resultRows.append("<h5>" + date.getFullYear() + " = " + histogramEntry.count + "</h5> ");
    });
}

