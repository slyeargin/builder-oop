(function() {
  'use strict';
  init();
  function init() {
    $('#autoseed').click(seed);
  }
  var isOn = false;
  var timer;
  function seed() {
    isOn = !isOn;
    $('#autoseed').toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(planting, 1000);
  }
  function planting() {
    var population = $('.alive:not(.beanstalk)').length;
    var userId = $('#user').attr('data-id');
    if (population < 50) {
      console.log('YOU CAN PLANT');
      ajax('/trees/plant', 'POST', {userId: userId}, (function(h) {
        $('#forest').append(h);
      }));
    }
  }
})();

//# sourceMappingURL=autoseed.map
