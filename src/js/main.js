(function(window, document, $) {
    'use strict';

    $(document).ready(function(e) {
        $('[data-toggle="tooltip"]').tooltip();

        var scrobble_form = document.getElementById('form-manual-scrobble'),
            login_button = document.getElementById('btn-login'),
            defer_scrobble_option = document.getElementById('defer'),
            now = new Date();

        if (scrobble_form) {
            $(scrobble_form)
                .on('submit', function(ev) {
                    var $fieldsets = $('fieldset', scrobble_form);
                    var list_of_tracks = {
                        'format': 'json',
                        'artist' : [],
                        'track': [],
                        'album': [],
                        'timestamp': []
                    };
                    var do_scrobble = true;

                    ev.preventDefault();

                    $fieldsets.each(function() {
                        var track_info = checkFieldData(this);

                        if (track_info) {
                            list_of_tracks.artist.push(track_info.artist);
                            list_of_tracks.track.push(track_info.track);
                            list_of_tracks.album.push(track_info.album);
                            list_of_tracks.timestamp.push(track_info.timestamp);
                        } else {
                            do_scrobble = false;
                        }
                    });

                    if (do_scrobble) {
                        scrobble(list_of_tracks);
                        $('input.form-control').not('#timestamp-picker input').val('').first().focus();
                    }
                })
                .one('submit', function() {
                    showScrobbleList();
                });

            $('.clockpicker').clockpicker();
            $('.date.input-group').datepicker({
                'format': "dd/mm/yyyy",
                'orientation': "top auto",
                'startDate': "-2w",
                'endDate': "+1d"
            });

            $('input', defer_scrobble_option).on('click', function(e) {
                $(e.target).parent().addClass('active').siblings().removeClass('active');
                if (e.target.id == 'custom-timestamp') {
                    $('#timestamp-picker').slideDown();
                    $('.clockpicker input').val(now.getHours() + ':' + ('0' + now.getMinutes()).substr(-2));
                    $('.date input').val( now.getDate() + '/' + ('0' + (now.getMonth() + 1)).substr(-2) + '/' + now.getFullYear());
                    $('.date.input-group').datepicker('setDate', new Date());
                    $('.date.input-group').datepicker('update');
                } else {
                    $('#timestamp-picker').slideUp();
                }
            });

            var acOptions = {
                callback: function (e, ui) {
                    if (
                        'undefined' !== typeof ui.item &&
                        'undefined' !== typeof ui.item.artist &&
                        'undefined' !== typeof ui.item.musicTitle
                    ) {
                        $($('.artist')[0]).val(ui.item.artist);
                        $($('.track')[0]).val(ui.item.musicTitle);
                    }
                },
                modules: [],
                apiKey: $.lastfm.key
            };

            if ($('.search').length) {
                acOptions.modules = ['track'];
                $($('.search')[0]).lfmComplete(acOptions);
            }
        }

        if (login_button) {
            $(login_button).on('click', function(ev) {
                // Thanks Dom Sammut! http://dsam.co/13MBWpD
                if (window.ga.hasOwnProperty('loaded') && window.ga.loaded === true) {
                    var dest_url = ev.target.href;

                    ev.preventDefault();

                    ga('send', 'event', 'btn-login', 'click', 'login', {
                        'hitCallback': function() {
                            document.location = dest_url;
                        }
                    });
                }
            });
        }

        function showScrobbleList() {
            var $scrobbled_tracks = $('#scrobbled-tracks');

            $scrobbled_tracks.find('.placeholder').fadeOut(200, function() {
                $scrobbled_tracks.find('.list').hide().removeClass('hidden').fadeIn();
            });
        }

        function checkFieldData(fieldset) {
            var artist = $(".artist", fieldset).val().trim();
            var track = $(".track", fieldset).val().trim();
            var album = $(".album", fieldset).val().trim();
            var timestamp, newTimestamp;

            if ($('#custom-timestamp').is(':checked')) {
                timestamp = $(".date.input-group").data('datepicker').getFormattedDate('yyyy-mm-dd');
                timestamp += ' ' + $(".clockpicker input").val() + ':00';
                newTimestamp = new Date(timestamp);

                // Convert timestamp string to UTC
                timestamp = newTimestamp.toISOString();

                newTimestamp.setMinutes(newTimestamp.getMinutes() + 3); // Adds 3 min to current time
                // Updates controls
                $('.date.input-group').datepicker('setDate', newTimestamp);
                $('.date.input-group').datepicker('update');
                $('.clockpicker input').val(newTimestamp.getHours() + ':' + ('0' + newTimestamp.getMinutes()).substr(-2));
            } else {
                timestamp = '';
            }

            if (artist !== '' && track !== '') {
                return {
                    'artist': artist,
                    'track' : track,
                    'album' : album,
                    'timestamp' : timestamp
                };
            } else {
                $(fieldset).addClass('has-error').attr('aria-invalid', 'true');
                return false;
            }
        }

        function scrobble(list_of_tracks, callback) {
            var $scrobbled_tracks_list = $('#scrobbled-tracks ul'),
                item_content = '',
                list_items = [],
                list_item;

            for (var i=0; i < list_of_tracks.track.length; i++) {
                item_content = '<li';
                item_content += ' data-artist="' + list_of_tracks.artist[i] + '"';
                item_content += ' data-track="' + list_of_tracks.track[i] + '"';
                item_content += ' data-album="' + list_of_tracks.album[i] + '"';
                item_content += ' data-timestamp="' + list_of_tracks.timestamp[i] + '"';
                item_content += '>';

                // Status icon
                item_content += '<span class="status"><span class="glyphicon glyphicon-cd"></span></span>';

                // Item text (artist + track)
                item_content += list_of_tracks.artist[i] + ' - ' + list_of_tracks.track[i];
                if (list_of_tracks.album[i]) {
                    item_content += ' <span class="text-muted">(' + list_of_tracks.album[i] + ')</span>';
                }

                // Toolbox
                item_content += '<span class="toolbox pull-right">';
                item_content += '<a href="#" class="repeat btn btn-xs btn-default">';
                item_content += '<span class="glyphicon glyphicon-repeat"></span>';
                item_content += ' Scrobble again';
                item_content += '</a>';
                item_content += '</span>';

                item_content += '</li>';

                list_items.push($(item_content).prependTo($scrobbled_tracks_list));
            }

            $.ajax(scrobble_form.getAttribute('action'), {
                type: 'POST',
                dataType: 'json',
                data: list_of_tracks,

                success: function(response) {
                    if (response['@attributes'].status == 'ok') {
                        // Send event
                        if (typeof(ga) !== 'undefined') {
                            ga('send', 'event', 'btn-scrobble', 'scrobble', 'manual scrobble', 1);
                        }

                        // Process the array of scrobbles
                        $(response.scrobbles.scrobble).each(function(i, scrobbled_track) {
                            var item = list_items.pop();

                            if (scrobbled_track.ignoredMessage['@attributes'].code == '0') {
                                item.find('.status').html('<span class="glyphicon glyphicon-ok"></span>');
                            } else {
                                item.find('.status').html('<span class="glyphicon text-warning glyphicon-exclamation-sign"></span>');
                            }
                            item.find('.repeat').on('click', function(e) {
                                var $item = $(e.target).parent(/*.toolbox*/).parent(/*li*/);
                                e.preventDefault();

                                scrobble({
                                    'format': 'json',
                                    'artist': [$item.attr('data-artist')],
                                    'track' : [$item.attr('data-track')],
                                    'album' : [$item.attr('data-album')],
                                    'timestamp' : ['']
                                });
                            });
                        });

                    } else if (response['@attributes'].status == 'failed') {
                        console.log('Error ' + response.error['@attributes'].code);
                        switch (response.error['@attributes'].code) {
                            case '11': // Service Offline - This service is temporarily offline. Try again later.
                            case '16': // There was a temporary error processing your request. Please try again.
                                // Wait and try again?
                                break;

                            case '9':  // Invalid session key - Please re-authenticate
                            case '29': // Rate limit exceeded - Your IP has made too many requests in a short period
                                // Log out the user
                                break;

                            default:
                                // Log error?
                                break;
                        }
                    }

                    callback && callback();
                },

                error: function(response) {
                    $.each(list_items, function(i, item) {
                        item.find('.status').html('<span class="glyphicon text-danger glyphicon-remove"></span>');
                    });
                    // ToDo: tell the user there was an error!
                    // ToDo: keep an eye on the callback here, it may lead to problems
                    console.log(response);
                    callback && callback();
                }
            }); // ajax
        }
    });

})(window, document, jQuery);
