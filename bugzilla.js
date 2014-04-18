(function(exports) {
    'use strict';

    var BZ_PATH = 'https://bugzilla.mozilla.org/rest/bug?';
    var BZ_PATH2 = 'https://bugzilla.mozilla.org/rest/bug/';
    var all_bugs = {};
    var debug = false;

    function fetch_from_bz(url) {
        var xhr = new XMLHttpRequest();
        var callback;
        var promise = new Promise(function(resolve) {
            callback = function(evt) {
                resolve(evt.target.response);
            };
        });
        xhr.addEventListener('load', callback);
        xhr.open('get', url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

        return promise.then(JSON.parse).then(function(root) {
            return root.bugs;
        });
    }

    function fetch_dependencies_of(main_bug) {
        if (debug) {
            return fetch_from_bz('mock.json');
        }
        return fetch_from_bz(BZ_PATH + 'id=' + main_bug).then(function(bugs) {
            // Let's also fetch info about the current bug
            bugs[0].depends_on.unshift(main_bug);
            var bugs_to_fetch = bugs[0].depends_on.map(function(id_number) {
                return 'id=' + id_number;
            });
            return fetch_from_bz(BZ_PATH + bugs_to_fetch.join('&'));
        });
    }

    function fetch_comments(bug_id) {
        if (debug) {
            return fetch_from_bz('mock' + bug_id + '.json');
        }
        return fetch_from_bz(BZ_PATH2 + bug_id + '/comment');
    }

    exports.Bugzilla = {
        fetch_dependencies_of: fetch_dependencies_of,
        fetch_comments: fetch_comments
    };
})(window);

