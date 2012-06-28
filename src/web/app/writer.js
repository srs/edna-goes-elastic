
function writeLogEntryElements(writeElementId, logEntryElement) {
    var logEntrySource = logEntryElement._source;
    $("#" + writeElementId + ' .resultRows').append('<div class="row result">' +
                                                    '<h3><a href="#">' + logEntrySource.description + '</a></h3>' +
                                                    '<div>' +
                                                    '<span class="label label-resource">' + logEntrySource.resource + '</span>' + '&nbsp;' +
                                                    '<span class="badge badge-success">' + logEntrySource.hours + '</span>' +
                                                    '</div>' +
                                                    '<div>' + logEntrySource.customer + ' - ' + logEntrySource.project + '</div>' +
                                                    '<div>' + '<span>' + logEntrySource.logDate + '</span>&nbsp;' + '</div>' +
                                                    '</div>' +
                                                    '</div>');
}


function getNumberOfPages(total, resultSize) {
    var numberOfPages = Math.ceil(total / resultSize);
    return numberOfPages;
}
function logEntryPagerWriter(writeElementId, data, currentPage) {

    console.log(currentPage);

    var total = data.hits.total;
    var resultSize = data.hits.hits.length;

    if (resultSize == 0) {
        return;
    }

    var pageButtonsElement = $("#" + writeElementId + ' .btn-group');

    pageButtonsElement.empty();

    var numberOfPages = getNumberOfPages(total, resultSize);

    if (pageButtonsElement.length > 0 && numberOfPages > 1) {

        var numberOfPagesToShow = numberOfPages;
        var appendLastElement = false;

        console.log("Number of PagesToLink: " + numberOfPagesToShow);

        if (numberOfPages > PAGER_MAX_PAGES) {
            numberOfPagesToShow = PAGER_MAX_PAGES;
            appendLastElement = true;
        }
        var rangeStart;
        var rangeEnd;

        if (currentPage - (numberOfPagesToShow/2) <= 0) {
            rangeStart = 1;
            rangeEnd = PAGER_MAX_PAGES;
        } else if (currentPage + (numberOfPagesToShow/2) >= PAGER_MAX_PAGES) {
            rangeStart = PAGER_MAX_PAGES - numberOfPagesToShow;
            rangeEnd = PAGER_MAX_PAGES;
        } else {
            rangeStart = currentPage - (numberOfPagesToShow/2);
            rangeEnd = currentPage + (numberOfPagesToShow/2);
        }


        pageButtonsElement.append('<button class="btn disabled">&larr; Previous</button>');

        for (var i = rangeStart; i <= rangeEnd; i++) {

            if (i == currentPage) {
                pageButtonsElement.append('<button class="btn active" data-toggle="button">' + i + '</button>');
            } else {
                pageButtonsElement.append(createLinkToPage(i));
            }
        }

        if (appendLastElement) {
            pageButtonsElement.append(' <button class="btn">' + '...' + '</button>');
            pageButtonsElement.append('<button class="btn">' + 'Next &rarr;' + '</button>');

        }
    }
}

function createLinkToPage(pageNum) {
    return '<button class="btn" data-pagenum="' + pageNum + '">' + pageNum + '</button>';
}

function logEntryWriter(writeElementId, data, page) {

    $.each(data.hits.hits, function (index, logEntry) {
        writeLogEntryElements(writeElementId, logEntry)
    });

    logEntryPagerWriter(writeElementId, data, page);
}
