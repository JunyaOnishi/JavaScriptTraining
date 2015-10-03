'use strict';

describe('ステージ5（意図通りに非同期処理を利用できる）', function() {
  describe('Promise 編', function() {
    it('resolve ハンドラーを書ける', function(testDone){
      var promise = Promise.resolve('resolved!');

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      // promise.then(function(msg) {
      //   expect(msg).to.equal('resolved!');
      //   testDone();
      // });
      promise.then(function(msg) {
        expect(msg).to.equal('resolved!');
        testDone();
      });
    });


    it('reject ハンドラーを書ける', function(testDone){
      var promise = Promise.reject('rejected!');

      // reject ハンドラーを使って、下の assertion が promise の
      // エラー値を検証できるように記述してください。
      //
      // expect(msg).to.equal('rejected!');
      // testDone();

      // ここにコードを記述してください。
      promise.catch(function(msg){
        expect(msg).to.equal('rejected!');
        testDone();
      });
    });


    it('複数の promise すべての完了を待つ promise を作成できる', function() {
      var messageFragments = ['あなたと', 'java', '今すぐダウンロード'];
      var promise1 = createWaitPromise(messageFragments[0], 10);
      var promise2 = createWaitPromise(messageFragments[1], 20);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise = Promise.all([
        promise1, promise2, promise3
      ]);

      return expect(promise).to.eventually.deep.equal(messageFragments);
    });


    it('複数の promise のうち最も速く解決された値をもつ promise を作成できる', function() {
      var messageFragments = ['30億の', 'デバイスで', '走るjava'];
      var promise1 = createWaitPromise(messageFragments[0], 30);
      var promise2 = createWaitPromise(messageFragments[1], 10);
      var promise3 = createWaitPromise(messageFragments[2], 30);

      // 作成した promise を promise 変数に代入してください。
      var promise = Promise.race([
        promise1, promise2, promise3
      ]);

      return expect(promise).to.eventually.equal(messageFragments[1]);
    });
  });


  describe('fetch API 編', function() {
    it('/api/friends API を使って Sugar の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Sugar';

      // チュートリアル
      //
      // ここに下記のコードを記述してください。
      //
      // var promisedFriends = fetch(api + username).then(function(res) {
      //   return res.json();
      // });
      var promisedFriends = fetch(api + username).then(function(res) {
        return res.json();
      });

      return expect(promisedFriends).to.eventually.have.length(1)
        .and.have.members(['PYXC-PJ']);
    });


    it('/api/friends API を使って Shen の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Shen';

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends = fetch(api + username)
        .then(function(res) {
          return res.json();
        });
      return expect(promisedFriends).to.eventually.have.length(2)
        .and.have.members(['jisp', 'TeJaS']);
    });


    it('/api/friends API を使って Shen の友人の友人を取得できる', function() {
      var api = '/api/friends/';
      var username = 'Shen';
      /**
       * 友人の取得を行う
       * @param  {string} usernameToFetch 友人の取得対象のユーザー名
       * @return {Thenable<Array<string>>} 友人の配列
       */
      var getFriends = function(usernameToFetch){
        var resolve = fetch(api + usernameToFetch)
          .then(function(response) {
            return response.json();
          });
        return resolve;
      }
      /**
       * 配列を平らにする。
       * @param  {Array<Array<T>>} arrayOfArray 配列の配列。
       * @return {Array<T>} 平らになった配列。
       */
      var faltMap = function(arrayOfArray) {
        var resolve = arrayOfArray.reduce(function(flatArray, array) {
          return flatArray.concat(array);
        }, []);
        return resolve;
      }
      var promisedFriends = getFriends(username)
        .then(function(friends) {
          return Promise.all(friends.map(getFriends));
        })
        .then(function(friendsArray) {
          return faltMap(friendsArray);
        });

      return expect(promisedFriends).to.eventually.have.length(1)
        .and.have.members(['TypeScript']);
    });


    it('/api/friends API を使って CoffeeScript の友人を再帰的に取得できる', function() {
      // 難易度高いので、自信のある人だけ挑戦してください。
      // it.skip の .skip を消せば、テストが走るようになります。
      var api = '/api/friends/';
      var username = 'CoffeeScript';
      /**
       * 友人を取得する
       * @param  {string} usernameToFetch 友人の取得対象のユーザー名
       * @return {Thenable<Array<string>>} 友人の配列
       */
      var getFriends = function(usernameToFetch) {
        return fetch(api + usernameToFetch)
          .then(function(response) {
            return response.json();
          });
      }

      /**
       * 配列 or 配列を持つPromiseを展開し、平らな配列を持つPromiseを返す。
       * @param  {Array<Thenable<T>> or Array<T>} arrayOfPromisedArray arrayOfPromisedArray promise またはオブジェクトの配列.
       * @return {Thenable<Array<T>>} 平らな配列を持つpromise.
       */
      var faltMap = function(arrayOfPromisedArray) {
        return Promise.all(arrayOfPromisedArray)
          .then(function(arrayOfArray) {
            return arrayOfArray.reduce(function(flatArray, array) {
              /*
                コラム的な何か ： なぜ、concatを使用しないのか?
                Javascriptには、破壊的な配列結合がない
                ※「破壊的な」とは、実行するだけで元の値が完全に捨てられる関数を指す。
                似たようなものを使うために.pushを使用したいのだが、下記の例だとflatArrayはObjectであって配列ではない。
                なので.pushを持ちあわせておらず、エラーになってしまう。
                全体メソッドであるArray.prototypeからpushメソッドを借りてきて実行しているのです。
                何たる黒魔術的な仕様か！キモチワルイ！慣れてください。
              */
              Array.prototype.push.apply(flatArray, array);
              return flatArray;
            })
          })
      }

      /**
       * 配列を結合する関数を返す
       * @param  {Array<T>} arrayA 関数の実行前に指定する、結合したい配列。
       * @return {function(Array<T>): Array<T>} arrayA と arrayBを結合する関数。
       */
      var concat = function(arrayA){
        return function(arrayB) {
          return arrayA.concat(arrayB)
        }
      }
      var getFriendsRecursively = function(usernameToFetch) {
        return getFriends(usernameToFetch)
          .then(function(friends) {
            if (friends.length == 0) return friends;
            var promisedFriendsOfFriends = Promise.all(friends.map(getFriendsRecursively));
            return promisedFriendsOfFriends
              .then(faltMap)
              .then(concat(friends));
          });
      }

      // 作成した promise を promisedFriends 変数に代入してください。
      var promisedFriends = getFriendsRecursively(username);

      return expect(promisedFriends).to.eventually.have.length(5)
        .and.have.members([
          'Taijilang',
          'purescript',
          'Wind.js',
          'ScriptBlocks',
          'jangaroo'
        ]);
    });


    it('Github の mixi-inc の organization の情報を取得できる', function() {

      // 作成した promise を mixiOrg 変数に代入してください。
      var mixiOrg = fetch('https://api.github.com/orgs/mixi-inc')
        .then(function(response) {
          return response.json();
        });

      return expect(mixiOrg).to.eventually.have.property('id', 1089312);

      // Github API に関する参考情報
      // https://developer.github.com/v3/orgs
    });


    it('Github API を使って、mixi-inc/JavaScriptTraining の情報を取得できる', function() {
      var repository = 'mixi-inc/JavaScriptTraining';

      // 作成した promise を mixiRepo 変数に代入してください。
      var mixiRepo = fetch('https://api.github.com/repos/' + repository)
        .then(function(response) {
          return response.json();
        });


      return expect(mixiRepo).to.eventually.have.property('full_name', repository);

      // Github API に関する参考情報
      // https://developer.github.com/v3/repos/
    });


    it('Github API を使って、VimL、Emacs Lisp でスターが最も多いプロダクト名を' +
       'それぞれ 1 つずつ取得できる', function() {
      var languages = [ 'VimL', '"Emacs Lisp"' ];
      /**
       * bQS[buildQueryString] Objectから,query stringを作成する。
       * @param  {Object<string, string>} queryMap パラメータの辞書オブジェクト
       * @return {string} query string
       */
      var  bQS= function(queryMap) {
        return Object.keys(queryMap)
          .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(queryMap[key]);
          })
          .join('&');
      }
      /**
       * sMPRBL[searchMostPopularRepositoryByLanguage]
       * 指定された言語で最もスターが多いリポジトリ名を返す。
       * @param  {string} lang 言語名
       * @return {Thenable<string>} 最もスターが多いリポジトリ名を持つpromise.
       */
      var sMPRBL = function(lang){
        var qS = bQS({
          q: 'language:' + lang,
          sort: 'stars'
        });
        return fetch('https://api.github.com/search/repositories?' + qS)
          .then(function(response) {
            return response.json();
          })
          .then(function(result) {
            return result.items[0].full_name;
          });
      }
      var mostPopularRepos = Promise.all(languages.map(sMPRBL));

      // 作成した promise を mostPopularRepos 変数に代入してください。

      return expect(mostPopularRepos).to.eventually.have.length(2)
        .and.satisfy(function(names) {
          return typeof names[0] === 'string' &&
            typeof names[1] === 'string';
        });

      // Github API に関する参考情報
      // https://developer.github.com/v3/search
    });
  });


  function createWaitPromise(value, msec) {
    return new Promise(function(resolve) {
      setTimeout(resolve, msec, value);
    });
  }
});
