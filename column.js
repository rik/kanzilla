(function(exports) {
    'use strict';

    var Column = function(name) {
        this._name = name;
        this._bugs = [];
        this._node = null;

        var that = this;

        function create_node() {
            that._node = document.getElementById('column-template').cloneNode(true);
            that._node.id = '';
            that._node.querySelector('.js-title').textContent = that._name.replace('-', ' ');

            document.body.appendChild(that._node);
            that._node.classList.remove('hidden');
        }
        create_node();
    };

    Column.prototype.append_bug = function(bug) {
        this._bugs.push(bug);

        this._node.querySelector('.js-bugs-container').appendChild(bug.node);
        this._node.querySelector('.js-bug-count').textContent = this._bugs.length;
    };

    exports.Column = Column;
})(window);
