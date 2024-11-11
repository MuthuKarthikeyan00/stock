function initializeDataTable(selector, ajaxUrl, columns) {
    $(document).ready(function() {
        $(selector).DataTable({
            serverSide: true,
            ajax: {
                url: ajaxUrl,
                type: 'POST',
                data: function(d) {
                    return {
                        draw: d.draw,
                        offset: d.start,
                        limit: d.length,
                        search: {
                            value: d.search.value,
                        },
                        order: d,
                        orderColumn: d.order[0].column,
                        orderDir: d.order[0].dir,
                    };
                },
            },
            columns: columns,
            responsive: true,
            paging: true,
            searching: true,
        });
    });
}