(function(window, document, $) {
    'use strict';

    $(document).ready(function(e) {
        $('[data-toggle="tooltip"]').tooltip();

        var scrobble_form = document.getElementById('form-manual-scrobble');

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
                        $('input.form-control').val('').first().focus();
                    }
                })
                .one('submit', function() {
                    showScrobbleList();
                })
                .find('.timestamp-checkbox').on('click', function (ev) {
                    var $this = $(this),
                        $timestamp = $this.siblings('.timestamp'),
                        now;

                    if ($this.prop('checked')) {
                        now = new Date();
                        $timestamp
                            .val(now.getFullYear() + '-' + now.getUTCMonth() + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes())
                            .prop('disabled', false);
                    } else {
                        $timestamp.val('').prop('disabled', true);
                    }
                });

            // Focus the first field so users can get scrobbling fast
            // FixMe: autofocus property on the input should do the trick ;)
            $('input.form-control').first().focus();
        }

        var login_button = document.getElementById('btn-login');
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
            var timestamp = $(".timestamp", fieldset);

            if (timestamp.is(':enabled')) {
                timestamp = new Date(timestamp.val());
                timestamp = timestamp ? timestamp.toUTCString() : '';
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
                list_item = '',
                appended_items = [];

            for (var i=0; i < list_of_tracks.track.length; i++) {
                list_item = '<li';
                list_item += ' data-artist="' + list_of_tracks.artist[i] + '"';
                list_item += ' data-track="' + list_of_tracks.track[i] + '"';
                list_item += ' data-album="' + list_of_tracks.album[i] + '"';
                list_item += ' data-timestamp="' + list_of_tracks.timestamp[i] + '"';
                list_item += '>';

                list_item += '<span class="status"><span class="glyphicon glyphicon-cd"></span></span>';

                list_item += list_of_tracks.artist[i] + ' - ' + list_of_tracks.track[i];
                if (list_of_tracks.album[i]) {
                    list_item += ' <span class="text-muted">(' + list_of_tracks.album[i] + ')</span>';
                }

                list_item += '</li>';

                appended_items.push($(list_item).prependTo($scrobbled_tracks_list));
            }

            $.ajax(scrobble_form.getAttribute('action'), {
                type: 'POST',
                dataType: 'json',
                data: list_of_tracks,

                success: function(response) {
                    f(response, appended_items);

                    function f(response, list_items){
                        if (response['@attributes'].status == 'ok') {
                            // Send event
                            if (typeof(ga) !== 'undefined') {
                                ga('send', 'event', 'btn-scrobble', 'scrobble', 'manual scrobble', 1);
                            }

                            // Here is the scrobbled track info
                            // ToDo: this works for ONLY ONE track!
                            var track = response.scrobbles.scrobble;

                            if (track.ignoredMessage['@attributes'].code == '0') {
                                $.each(list_items, function(i, item) {
                                    item.find('.status').html('<span class="glyphicon glyphicon-ok"></span>');
                                });
                            } else {
                                $.each(list_items, function(i, item) {
                                    item.find('.status').html('<span class="glyphicon text-warning glyphicon-exclamation-sign"></span>');
                                });
                            }
                            //item += ' ' + track.artist + ' - ' + track.track;

                            // Clear the form if it went ok
                            // if (response['@attributes'].status == 'ok') {
                            //     $('input.form-control').val('').first().focus();
                            // }
                        }
                        callback && callback();
                    }
                }, // success function

                error: function(response) {
                    f(response, appended_items);

                    function f(response, list_items){
                        $.each(list_items, function(i, item) {
                            item.find('.status').html('<span class="glyphicon text-danger glyphicon-remove"></span>');
                        });
                        // ToDo: tell the user there was an error!
                        // ToDo: keep an eye on the callback here, it may lead to problems
                        console.log(response);
                        callback && callback();
                    }
                } // error function
            }); // ajax
        }
    });

})(window, document, jQuery);
