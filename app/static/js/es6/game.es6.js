/* jshint unused:false */

var audioChop, audioBeanStalk;

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  'use strict';
  $.ajax({url: url, type: type, dataType: dataType, data: data, success: success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getforest', forest);
    $('#dashboard').on('click', '#getcash', cash);
    $('#dashboard').on('click', '#getautogrow', autogrow);
    $('#dashboard').on('click', '#getautoseed', autoseed);
    $('#dashboard').on('click', '#getautoroot', autoroot);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    preloadAssets();
  }

  function preloadAssets(){
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/chop.mp3';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/grow.mp3';
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, h =>{
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
      forest();
    }, 'json');
  }

  function plant(){
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'POST', {userId: userId}, h =>{
      $('#forest').append(h);
    });
  }

  function grow(){
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(`/trees/${treeId}/grow`, 'PUT', null, t => {
        tree.replaceWith(t);
        if($(t).hasClass('beanstalk')){
          audioBeanStalk.play();
        }
      });
  }

  function chop(){
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(`/trees/${treeId}/chop`, 'PUT', null, t=> {
        tree.replaceWith(t.response);
        $('#wood').text(t.user.wood);
      }, 'json');
  }

  function cash(){
    audioChop.play();
    var woodToCash = $('#cashout').val();
    var userId = $('#user').attr('data-id');
    ajax(`/cash/${userId}`, 'PUT', {cashout: woodToCash}, t => {
        $('#wood').text(t.user.wood);
        $('#cash').text(t.user.cash);
      }, 'json');
  }

  function autogrow(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}/purchase/autogrow`, 'put', null, h=>{
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
    }, 'json');
  }

  function autoseed(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}/purchase/autoseed`, 'put', null, h=>{
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
    }, 'json');
  }

  function autoroot(){
    var userId = $('#user').attr('data-id');
    ajax(`/users/${userId}/purchase/autoroot`, 'put', null, h=>{
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
    }, 'json');
  }

  function forest(){
    var userId = $('#user').attr('data-id');
    ajax('/trees?userId=' + userId, 'get', null, h=>{
      $('#forest').empty().append(h);
    });
  }

})();
