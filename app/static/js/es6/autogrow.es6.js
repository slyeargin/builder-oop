/* global ajax, audioBeanStalk */

(function(){
  'use strict';

  init();

  function init(){
    $('#autogrow').click(grow);
    slider();
  }

  var isOn = false;
  var timer;

  function slider(){
    $('#slider').noUiSlider({
      start: 4,
      range: {
        'min': 4,
        'max': 9999
      },
      serialization: {
        lower: [
          $.Link({
            target: $('#value'),
            method: 'text'
        })],
        format: {
          decimals: 0,
          postfix: ' ft'
        }
      }
    });
  }

  function grow(){
    isOn = !isOn;
    $('#autogrow').toggleClass('on');

    if(isOn){
      start();

    } else {
      clearInterval(timer);
    }
  }

  function start(){
    clearInterval(timer);
    timer = setInterval(growing, 1000);
  }

  function growing(){
    $('.alive:not(.beanstalk)').map((i,d)=>$(d).attr('data-id')).each((i, v)=>{
      var tree = $(`.tree[data-id=${v}]`);
      var chopHeight = parseFloat($('#value').text());
      ajax(`/trees/${v}/grow`, 'PUT', null, t => {
        tree.replaceWith(t);

        var height = parseFloat($(t).children('.height').text());

        if (height >= chopHeight) {
          ajax(`/trees/${v}/chop`, 'PUT', null, t=> {
              tree.replaceWith(t.response);
              $('#wood').text(t.user.wood);
            }, 'json');
        }

        if($(t).hasClass('beanstalk')){
          audioBeanStalk.play();
        }
      });
    });
  }

})();
