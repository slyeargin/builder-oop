var audioChop,
    audioBeanStalk;
function ajax(url, type) {
  'use strict';
  var data = arguments[2] !== (void 0) ? arguments[2] : {};
  var success = arguments[3] !== (void 0) ? arguments[3] : (function(r) {
    return console.log(r);
  });
  var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}
(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getforest', forest);
    $('#dashboard').on('click', '#getcash', cash);
    $('#dashboard').on('click', '#getautogrow', autogrow);
    $('#dashboard').on('click', '#getautoseed', autoseed);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    preloadAssets();
  }
  function preloadAssets() {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/chop.mp3';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/grow.mp3';
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, (function(h) {
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
      forest();
    }), 'json');
  }
  function plant() {
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'POST', {userId: userId}, (function(h) {
      $('#forest').append(h);
    }));
  }
  function grow() {
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(("/trees/" + treeId + "/grow"), 'PUT', null, (function(t) {
      tree.replaceWith(t);
      if ($(t).hasClass('beanstalk')) {
        audioBeanStalk.play();
      }
    }));
  }
  function chop() {
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(("/trees/" + treeId + "/chop"), 'PUT', null, (function(t) {
      tree.replaceWith(t.response);
      $('#wood').text(t.user.wood);
    }), 'json');
  }
  function cash() {
    audioChop.play();
    var woodToCash = $('#cashout').val();
    var userId = $('#user').attr('data-id');
    ajax(("/cash/" + userId), 'PUT', {cashout: woodToCash}, (function(t) {
      $('#wood').text(t.user.wood);
      $('#cash').text(t.user.cash);
    }), 'json');
  }
  function autogrow() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/" + userId + "/purchase/autogrow"), 'put', null, (function(h) {
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
    }), 'json');
  }
  function autoseed() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/" + userId + "/purchase/autoseed"), 'put', null, (function(h) {
      $('#dashboard').empty().append(h.dashboard);
      $('#items').empty().append(h.inventory);
    }), 'json');
  }
  function forest() {
    var userId = $('#user').attr('data-id');
    ajax('/trees?userId=' + userId, 'get', null, (function(h) {
      $('#forest').empty().append(h);
    }));
  }
})();

//# sourceMappingURL=game.map
