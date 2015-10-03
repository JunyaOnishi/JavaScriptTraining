'use strict';

describe('ステージ3（意図した通りに DOM 要素の構造を変更できるようになる）', function() {
  describe('DOMインターフェース編', function() {
    it('1 番の要素から幽霊要素を除去する', function() {

      // チュートリアル
      //
      // ここに以下のコードを記述してください。
      //
      // var element = document.querySelector('#firebrick');
      // var ghost = document.querySelector('.firebrick-ghost');
      // element.removeChild(ghost);
      var element = document.getElementById('firebrick');
      var ghost = document.getElementsByClassName('firebrick-ghost')[0];
      element.removeChild(ghost);

      var firebrick = document.getElementById('firebrick');
      expect(firebrick.childNodes.length).to.equal(1);
      expect(firebrick).to.have.property('textContent', '1');
    });


    it('2 番の要素からインベーダー要素を除去する', function() {
      var element = document.getElementById('chocolate')
      var invader = document.getElementsByClassName('chocolate-space-invader')[0]
      element.removeChild(invader)


      var darkorange = document.getElementById('chocolate');
      expect(darkorange.childNodes.length).to.equal(1);
      expect(darkorange).to.have.property('textContent', '2');
    });


    it('3 番の要素の左右の幽霊要素をすべて除去する', function() {

      var element = document.getElementsByClassName('mediumseagreen')[0];
      var ghosts = document.getElementsByClassName('mediumseagreen-ghosts');
      for (var i = ghosts.length-1, j = 0;  0 <= i ; i-- ) {
        var ghost = ghosts[j];
        element.removeChild(ghost);
      }
      var darkorange = document.querySelector('.mediumseagreen');
      expect(darkorange).to.have.property('textContent', '3\uD83C\uDF3F');
    });


    it('4 番の水色の要素の最後に要素を追加する', function() {
      var elementToAdd = document.createElement('span');
      elementToAdd.textContent = '\uD83D\uDC2C';
      var element = document.getElementsByClassName('turquoise')[0];
      element.appendChild(elementToAdd);

      var turquoise = document.querySelector('.turquoise');
      expect(turquoise.childNodes.length).to.equal(2);
      expect(turquoise).to.have.deep.property('childNodes[0].textContent', '4');
      expect(turquoise).to.have.deep.property('childNodes[1]').equal(elementToAdd);
    });


    it('5 番の青色の要素の最初に要素を追加する', function() {
      var elementToAdd = document.createElement('span');
      elementToAdd.textContent = '\uD83D\uDC1F';
      var element = document.querySelector('.js-training-container li blockquote');
      element.insertBefore(elementToAdd, element.firstChild);

      var blockquote = document.querySelector('blockquote');
      expect(blockquote.childNodes.length).to.equal(2);
      expect(blockquote).to.have.deep.property('childNodes[0]').equal(elementToAdd);
      expect(blockquote).to.have.deep.property('childNodes[1].textContent', '5');
    });
  });


  describe('jQuery 編', function() {
    it('6 番の要素から幽霊要素を除去する', function() {

      // チュートリアル
      //
      // jQuery でも同じことをおこなってみましょう。
      // ここに以下のコードを記述してください。
      //
      // $('.brown-ghost').remove();
      $('.brown-ghost').remove()

      var $brown = $('#brown');
      expect($brown.children()).to.have.length(0);
      expect($brown).to.have.text('6');
    });


    it('7 番の要素からインベーダー要素を除去する', function() {

      $('#darkorange .darkorange-space-invader').remove()


      var $darkorange = $('#darkorange');
      expect($darkorange.children()).to.have.length(0);
      expect($darkorange).to.have.text('7');

      // 参考情報
      // http://api.jquery.com/category/manipulation/
    });


    it('8 番の要素の左右の幽霊要素をすべて除去する', function() {

      $('.limegreen-ghosts').remove()


      var $limegreen = $('.limegreen');
      expect($limegreen).to.have.text('8\uD83C\uDF3F');
    });


    it('9 番の水色の要素の最後に要素を追加する', function() {
      var $elementToAdd = $('<span>\uD83D\uDC2C</span>');

      $('.mediumturquoise').append($elementToAdd)


      var $mediumturquoise = $('.mediumturquoise');
      expect($mediumturquoise.children()).to.have.length(1);
      expect($mediumturquoise).to.have.text('9\uD83D\uDC2C');
    });


    it('10 番の青色の要素の最初に要素を追加する', function() {
      var $elementToAdd = $('<span>\uD83D\uDC1F</span>');

      $('.js-training-container:nth-child(2) li p').prepend($elementToAdd)


      var $p = $('p');
      expect($p.children()).to.have.length(1);
      expect($p).to.have.text('\uD83D\uDC1F10');
    });
  });
});
