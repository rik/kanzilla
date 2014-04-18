/* global Bugzilla */

(function(exports) {
    'use strict';

    var Bug = function(raw_bug) {
        this.raw_bug = raw_bug;
        this.status = (this.raw_bug.status === 'RESOLVED') ? 'Done' : 'Backlog';
        this.node = null;
        this.tags = [];

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
                        that.node.classList.add('blocked');
                    }

                    that.column = 'Backlog';
                    if (that.raw_bug.status === 'RESOLVED') {
                        that.column = (that.raw_bug.resolution === 'VERIFIED') ? 'Done' : 'QA';
                    } else {
                        that.tags.some(function(tag) {
                            var regexp = /kanban-(.+)/.exec(tag);
                            if (regexp) {
                                that.column = regexp[1];
                                return true;
                            }
                            return false;
                        });
                    }

                    resolve(that);
                });
            });
        }
        create_node();
        gather_comments();

        return promise;
    };

    exports.Bug = Bug;
})(window);
