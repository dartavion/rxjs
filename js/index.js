'use strict';

(function () {
    var URL = 'ADD URL HERE';
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


    var select = document.querySelector('select');
    var selectAction = Observable.fromEvent(select, 'change');
    selectAction.subscribe(function (event){
        if(event.target.selectedIndex === 0) {
            getSome(20);
        } else if (event.target.selectedIndex === 1) {
            console.log(';kj;k');
            getSome(20);
        } else if (event.target.selectedIndex === 2) {
            console.log('woah');
            getSome(19);
        } else if (event.target.selectedIndex === 3) {
            getSome(19);
        }

    });
    function updateUi (cards) {
        var el = document.querySelector('.container ul');

        cards.forEach(function(card) {

            var li = document.createElement('li');
            var span = document.createElement('span');
            var img = document.createElement('img');
            var ok = document.createElement('button');
            var cancel = document.createElement('button');

            ok.innerText = "Pass";
            ok.classList.add('blue');
            ok.classList.add('raised');
            cancel.innerText = "Reject";
            cancel.classList.add('gray');
            cancel.classList.add('raised');
            if (card.attachments !== undefined) {
                img.src = card.attachments[0].thumbnail_url;
            }

            span.innerHTML = card.html;

            li.appendChild(img);
            li.appendChild(span);
            li.appendChild(ok);
            li.appendChild(cancel);
            el.appendChild(li);
        });
    }

    function getSome (social) {
        console.log('get here?');
        var responseStream = requestStream.flatMap(function (url) {

            return Observable.fromPromise(getJSON('GET', url))
                .map(function (data) {

                    return data.headDocument.content
                        .filter(function (cards) {
                            return cards.source === social;
                        })
                        .map(function (card) {
                            return {
                                id: card.collectionId,
                                html: card.content.bodyHtml,
                                attachments: card.content.attachments
                            };
                            // could update database here
                        }).filter(function (cards) {
                            return cards.html !== undefined;
                        });
                });
        });
        responseStream.subscribe(function (data) {
            updateUi(data);
            // could update database here
        });

    }
    getSome(20);

})();
