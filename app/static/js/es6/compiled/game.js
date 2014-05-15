(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getforest', forest);
    $('#dashboard').on('click', '#getcash', cash);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, (function(h) {
      $('#dashboard').empty().append(h);
    }));
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
    var woodToCash = $('#cashout').val();
    var userId = $('#user').attr('data-id');
    ajax(("/cash/" + userId), 'PUT', {cashout: woodToCash}, (function(t) {
      $('#wood').text(t.user.wood);
      $('#cash').text(t.user.cash);
    }), 'json');
  }
  function forest() {
    var userId = $('#user').attr('data-id');
    ajax('/trees?userId=' + userId, 'get', null, (function(h) {
      $('#forest').empty().append(h);
    }));
  }
  function ajax(url, type) {
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
})();

//# sourceMappingURL=game.map
