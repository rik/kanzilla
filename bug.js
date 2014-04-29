/* global Bugzilla */

(function(exports) {
    'use strict';

    var Bug = function(raw_bug) {
        this.raw_bug = raw_bug;
        this.node = null;
        this.tags = [];
        this.column = null;

        var that = this;
        var promise;

        function create_node() {
            that.node = document.getElementById('bug-template').cloneNode(true);
            that.node.id = '';
            var a = that.node.querySelector('a');
            a.href += that.raw_bug.id;
            a.textContent = that.raw_bug.summary;
            that.node.classList.remove('hidden');
        }

        function gather_comments() {
            promise = new Promise(function(resolve) {
                Bugzilla.fetch_comments(that.raw_bug.id).then(function(bug) {
                    that.tags = bug[Object.keys(bug)[0]].comments[0].tags;
                    if (that.tags.indexOf('blocked') !== -1) {
                        that.node.classList.add('bug--blocked');
                    }

                    that.column = 'Backlog';
                    that.tags.some(function(tag) {
                        var regexp = /kanban-(.+)/.exec(tag);
                        if (regexp) {
                            that.column = regexp[1];
                            return true;
                        }
                        return false;
                    });

                    resolve(that);
                });
            });
        }

        create_node();

        // Let's dump the bugs that have been closed without code
        if (['WORKSFORME', 'INVALID', 'DUPLICATE'].indexOf(that.raw_bug.resolution) !== -1) {
            promise = Promise.resolve(that);
        } else if (that.raw_bug.status === 'RESOLVED') {
            that.column = 'QA';
            promise = Promise.resolve(that);
        } else if (that.raw_bug.status === 'VERIFIED') {
            that.column = 'Done';
            promise = Promise.resolve(that);
        } else {
            gather_comments();
        }

        return promise;
    };

    exports.Bug = Bug;
})(window);
