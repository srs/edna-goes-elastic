var totalHours;

function getAvatarUrl(user, size) {
    var email = user.toLowerCase() + "@enonic.com";
    var hash = md5(email);

    // return "http://www.gravatar.com/avatar/" + hash + ".jpg?s=" + size + "&d=monsterid";
    return "http://robohash.org/" + hash + ".png?size=" + size + "x" + size + "&set=set1";
}

function writeLogEntryElements(writeElementId, logEntryElement) {
    var logEntrySource = logEntryElement._source;
    var rowResult = $("#" + writeElementId);

    logEntrySource.avatarUrl = getAvatarUrl(logEntrySource.resource, 60);

    var source = $("#log-entry-template").html();
    var result = Mustache.render(source, logEntrySource);

    rowResult.append(result);
}

function getNumberOfPagesNeeded(total, resultSize) {

    var numberOfPages = Math.ceil(total / resultSize) - 1;
    return numberOfPages;
}

function logEntryPagerWriter(writeElementId, data, currentPage) {

    var total = data.hits.total;
    var resultSize = data.hits.hits.length;
    var pageButtonsElement = $("#mainPager");
    pageButtonsElement.empty();

    if (resultSize == 0) {
        return;
    }

    var numberOfPagesNeeded = getNumberOfPagesNeeded(total, RESULT_COUNT);

    if (numberOfPagesNeeded > 1) {

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


        if (startAtBeginning) {
            rangeStart = 1;
            rangeEnd = PAGER_MAX_PAGES;
        } else if (endAtNumberOfPagesNeeded) {
            rangeStart = parseInt(numberOfPagesNeeded) - parseInt(numberOfPagesToShow);
            rangeEnd = numberOfPagesNeeded;
        } else {
            rangeStart = parseInt(currentPage) - parseInt(pageOffsetFromCurrent) + 1;
            rangeEnd = parseInt(currentPage) + parseInt(pageOffsetFromCurrent) - 1;
        }

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

    var writeToElement = $("#" + writeElementId);
    writeToElement.empty();

    if (data.hits.hits.length == 0) {
        writeToElement.append('<h3>No hits</h3>')
    }
    else {
        $.each(data.hits.hits, function (index, logEntry) {
            writeLogEntryElements(writeElementId, logEntry)
        });
    }

    jQuery("abbr.timeago").timeago();
    logEntryPagerWriter(writeElementId, data, page);
}

function statsWriter(writeElementId, data, page) {

    //var resultRows = $("#" + writeElementId);

   // data.facets.stat1.total = roundToOneDecimal(data.facets.stat1.total);
   // data.facets.stat1.mean = roundToOneDecimal(data.facets.stat1.mean);

    totalHours = data.facets.stat1.total;

   // var source = $("#hour-stats-template").html();
   // var result = Mustache.render(source, data.facets.stat1);

   // resultRows.append(result);
}

function roundToOneDecimal(number) {
    return Math.round(number * 10) / 10;
}


function termFacetWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    resultRows.append("<h4>Customers:</h4> ");

    $.each(data.facets.tag.terms, function (index, facetEntry) {
        resultRows.append('<div class="facetEntry">' + facetEntry.term + " (" + facetEntry.count + ")</div> ");
    });
}

function dateHistogramWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    resultRows.append("<h4>Date histogram:</h4> ");

    $.each(data.facets.histo1.entries, function (index, histogramEntry) {
        var date = new Date(histogramEntry.time);
        resultRows.append('<div class="facetEntry">' + date.getFullYear() + " = " + histogramEntry.count + "</div>");
    });
}

function hoursPerCustomerWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    resultRows.append("<h4>Customer hours:</h4> ");

    $.each(data.facets.tag_term_stat.terms, function (index, facetEntry) {

        console.log(facetEntry);
        resultRows.append('<div class="facetEntry">' + facetEntry.term + " (" + facetEntry.count + ") = " + Math.round(facetEntry.total) +
                          " hours </div> ");
    });
}

function topGuysWriter(writeElementId, data, page) {

    var resultRows = $("#" + writeElementId);

    console.log(data.facets.tag_term_stat.terms);

    $.each(data.facets.tag_term_stat.terms, function (index, facetEntry) {

        facetEntry.avatarUrl = getAvatarUrl(facetEntry.term, 100);

        facetEntry.percentage = Math.round((facetEntry.total / totalHours) * 100);

        var source = $("#top-guys-template").html();
        var result = Mustache.render(source, facetEntry);
        resultRows.append(result);
    });


}


