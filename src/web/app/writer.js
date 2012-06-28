
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

        var numerOfPagesToLink = numberOfPages;
        var appendLastElement = false;

        console.log("Number of PagesToLink: " + numerOfPagesToLink);

        if (numberOfPages > PAGER_MAX_PAGES) {
            numerOfPagesToLink = PAGER_MAX_PAGES;
            appendLastElement = true;
        }

        pageButtonsElement.append('<button class="btn disabled">&larr; Previous</button>');

        for (var i = 1; i <= numerOfPagesToLink; i++) {

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
