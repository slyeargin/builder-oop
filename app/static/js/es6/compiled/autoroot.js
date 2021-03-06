(function() {
  'use strict';
  init();
  function init() {
    $('#autoroot').click(uproot);
  }
  var isOn = false;
  var timer;
  function uproot() {
    isOn = !isOn;
    $('#autoroot').toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(uprooting, 1000);
  }
  function uprooting() {
    var dead = $('.dead').length;
    if (dead > 0) {
      $('.dead').map((function(i, d) {
        return $(d).attr('data-id');
      })).each((function(i, v) {
        var tree = $((".tree[data-id=" + v + "]"));
        ajax(("/trees/" + v + "/remove"), 'delete', null, (function(t) {
          tree.remove();
        }));
      }));
    }
  }
})();

//# sourceMappingURL=autoroot.map
