/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#getforest', forest);
    $('#dashboard').on('click', '#getcash', cash);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
  }

  function login(){
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, h =>{
      $('#dashboard').empty().append(h);
    });
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
    var woodToCash = $('#cashout').val();
    var userId = $('#user').attr('data-id');
    ajax(`/cash/${userId}`, 'PUT', {cashout: woodToCash}, t => {
        $('#wood').text(t.user.wood);
        $('#cash').text(t.user.cash);
      }, 'json');
  }

  function forest(){
    var userId = $('#user').attr('data-id');
    ajax('/trees?userId=' + userId, 'get', null, h=>{
      $('#forest').empty().append(h);
    });

  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
    $.ajax({url: url, type: type, dataType: dataType, data: data, success: success});
  }

})();
