/**
 * Set listing list container height to fix exactly window minus nav and banner.
 */
function set_scroll_wrapper_height() {
    // Window height - navbar height - banner height - filter bar height
    var h = $(window).height() - $('.navbar').height() - $('.banner').height() - $('.filter-container').outerHeight();

    $('.listing-list-container').height(h);
}

var timeoutID = null;
/**
 * Resize listing list container height on widow resize, with 200ms lag.
 */
function scroll_wrapper_window_resize() {
    if (timeoutID != null) {
        clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(set_scroll_wrapper_height, 200);
}

/**
 * Event handler for filter option change operation.
 */
function filter_changed() {
    var val = $(this).find('option').filter(':selected').val();
    var filter_wrapper = $(this).parent();

    switch(val) {
        case 'all':
            filter_wrapper.find('input').remove();
            filter_wrapper.find('.semester-select').remove();
            filter_wrapper.css('width', '');
            break;
        case 'title':
        case 'isbn':
        case 'class':
        case 'prof':
            if (filter_wrapper.find('input').length != 0) {
                break;
            }

            filter_wrapper.find('.semester-select').remove();
            filter_wrapper.width(300);
            filter_wrapper.append('<input type="text" class="form-control filter-input" />');
            break;
        case 'semester':
            if (filter_wrapper.find('select').length > 1) {
                break;
            }

            $.get(SEMESTER_URL, function(data) {
                var name_map = {};
                $.ajax({
                    url: SEMESTER_LOOKUP_URL,
                    async: false,
                    success: function(data) {
                        name_map = data;
                    }
                });

                filter_wrapper.find('input').remove();
                filter_wrapper.width(300);
                filter_wrapper.append('<select class="form-control semester-select"></select>');

                for (var i = 0; i < data.length; i++) {
                    var sem_val = data[i].semester + ' ' + data[i].year;
                    var sem_str = name_map.forward[data[i].semester] + ' ' + data[i].year;

                    var s = filter_wrapper.find('.semester-select');
                    s.append(new Option(sem_str, sem_val));
                }
            });
            break;
    }
}

/**
 * Event handler for selection of a listing from the list.
 */
function listing_selected() {
    // TODO: unmock this!!!
    var listing_info = $('.listing-info');
    var is_separate = listing_info.is(':visible');

    function append_info(container) {
        container.append('<h2>Listing Information</h2>');
        container.append('<dl class="dl-horizontal"></dl>');

        var dl = container.find('dl');
        dl.append(
                '<dt>Title:</dt>' +
                        '<dd>Book Title Goes Here</dd>' +
                        '<dt>Authors:</dt>' +
                        '<dd>John Doe, Jane Doe</dd>' +
                        '<dt>Edition:</dt>' +
                        '<dd>3</dd>' +
                        '<dt>ISBN:</dt>' +
                        '<dd>123-4-56-789012-3</dd>' +
                        '<dt>Course Code:</dt>' +
                        '<dd>ABCD123</dd>' +
                        '<dt>Semester:</dt>' +
                        '<dd>Fall 1999</dd>' +
                        '<dt>Professor:</dt>' +
                        '<dd>Professor goes here</dd>'
        );

        container.append('<p>Asking Price: <span>$100.00</span></p>');
        container.append('<button type="button" class="btn btn-success">Contact Seller</button>');

    }

    if (is_separate) {
        $('.listing-list .listing.selection').removeClass('selection');
        $(this).addClass('selection');

        listing_info.empty();
        append_info(listing_info);

    } else {
        var listing_list = $('.listing-list');
        var cached_list = listing_list.html();

        listing_list.empty();
        listing_list.append(
                '<button class="btn btn-default listing-back"><span class="glyphicon glyphicon-chevron-left"></span> Back</button>'
        );
        append_info(listing_list);

        listing_list.find('button.listing-back').on('click', function() {
            listing_list.html(cached_list);

            // Re-apply click handlers for list elements
            $('.listing-list .listing').on('click', listing_selected);
        });

        // TODO: stuff needs to happen on window resize
    }
}

/**
 * Event handler for click on add filter field button.
 */
function add_filter_field() {
    $('.listing-filter-wrapper').append(
        '<div class="listing-filter-group">' +
            '<select class="form-control listing-filter">' +
            '<option value="all">All Books</option>' +
            '<option value="title">Title</option>' +
            '<option value="isbn">ISBN</option>' +
            '<option value="class">Class Code</option>' +
            '<option value="semester">Semester</option>' +
            '<option value="prof">Professor</option>' +
            '</select>' +
        '</div>'
    );

    var lf = $('.listing-filter');
    lf.off('change');
    lf.on('change', filter_changed);
}

$(document).ready(function() {
    // TODO: sorting listings
    // TODO: filtering listings logic
    // TODO: pagination front-end
    $('.add-filter-field').on('click', add_filter_field);
    $('.listing-filter').on('change', filter_changed);
    $(window).on('resize', scroll_wrapper_window_resize);

    // Load the listing list
    $.get(LISTING_LIST_URL, function(data) {
        $('.listing-list-container').html(data);
        $('.listing-list .listing').on('click', listing_selected);
    });
});

$(window).load(function() {
    set_scroll_wrapper_height();
});