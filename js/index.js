'use strict';

(function () {
    var URL = 'https://coxradio.bootstrap.fyre.co/bs3/v3.1/coxradio.fyre.co/377241/ZGVzaWduZXItYXBwLTE0NDc3MDI2NDc4NjU=/init';
    var TWITTER = 20;
    var INSTAGRAM = 19;
    function getJSON(method, url) {
        // DO NOT NEED PROMISE AS WE ARE USING OBSERVABLES
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();

            req.open(method, url);
            req.responseType = 'json';
            req.setRequestHeader("Accept", "application/json");
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
            };
            req.send()
        });
    }

    var Observable = Rx.Observable;
    var requestStream = Observable.just(URL);
    var responseStream = requestStream.flatMap(function (url) {
        return Observable.fromPromise(getJSON('GET', url))
            .map(function(data) {
                return data.headDocument.content
                .filter(function (card) {
                    return card.source === TWITTER;
                })
                .map(function(card) {
                    return {
                        id: card.collectionId,
                        html: card.content.bodyHtml,
                        attachments: card.content.attachments
                    };
                    // could update database here
            });
        });
    });

    function updateUi (cards) {
        var el = document.querySelector('.container ul');

        cards.forEach(function(card) {
            var li = document.createElement('li');
            var div = document.createElement('div');
            var img = document.createElement('img');
            img.src = card.attachments[0].thumbnail_url;
            div.innerHTML = card.html;

            li.appendChild(img);
            li.appendChild(div);
            el.appendChild(li);
        });
    }


    responseStream.subscribe(function (data) {
        updateUi(data);
        // could update database here
    });
})();
