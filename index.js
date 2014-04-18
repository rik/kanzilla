/* global Bug, Bugzilla, Column */

(function(exports) {
  'use strict';

    function init() {
        var main_bug = parseInt(location.search.substr(1), 10);
        var depends_on = Bugzilla.fetch_dependencies_of(main_bug);

        depends_on.then(function(bugs) {
            var columns = {};

            var main_bug_object;
            var depends_on = bugs.filter(function(bug_object) {
                if (bug_object.id === main_bug) {
                    main_bug_object = bug_object;
                    return false;
                }

                return true;
            });

            var main_bug_promise = new Bug(main_bug_object);
            var columns_promise = main_bug_promise.then(extract_columns);

            depends_on.forEach(function(bug_object) {
                var bug_promise = new Bug(bug_object);
                Promise.all([bug_promise, columns_promise]).then(function(values) {
                    var bug = values[0];
                    var columns = values[1];

                    if (!columns[bug.column]) {
                        console.warn('Bug ', bug_object.id, ' uses a bad tag: ', bug.column);
                        return;
                    }
                    columns[bug.column].append_bug(bug);
                });
            });
        });
    }

    function extract_columns(bug) {
        var column_names = [
            {name: 'Backlog', order: 0},
            {name: 'QA', order: 999},
            {name: 'Done', order: 1000}
        ];

        bug.tags.forEach(function(tag) {
            var regexp = /^kanban-(\d+)-(.+)$/i.exec(tag);
            if (regexp) {
                column_names.push({order: regexp[1], name: regexp[2]});
            }
        });

        column_names.sort(function(a, b) {
            return a.order - b.order;
        });

        var columns = {};
        column_names.forEach(function(column) {
            columns[column.name] = new Column(column.name);
        });

        return columns;
    }

    init();
})();
