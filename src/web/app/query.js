function fetchDataToElement(query, elementId, writerFunction, page) {
    $.ajax({
        url: "http://leela:9200/edna3000/edna/_search",
        type: "POST",
        dataType: "json",
        data: JSON.stringify(query),
        success: function (data) {

            var resultRowsElements = $('.resultRows');
            resultRowsElements.empty();
            resultRowsElements.hide();
            writerFunction.call(window, elementId, data, page);
            resultRowsElements.fadeIn(100);
        }
    });
}






