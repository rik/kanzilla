(function(exports) {
    'use strict';

    var count = 0;

    function show() {
        document.getElementById('overlay').classList.remove('hidden');
        count += 1;
    }

    function hide() {
        count -= 1;
        if (count === 0) {
            document.getElementById('overlay').classList.add('hidden');
        }
    }

    exports.Overlay = {
        show: show,
        hide: hide
    };
})(window);
