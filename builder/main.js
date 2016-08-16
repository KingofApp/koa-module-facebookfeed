var koappComm = (function(){

  return {
    main  : main(),
    iframe: iframe()
  };

  function main(){

    var listeners = {
      ready: new Array(0),
      data:  new Array(0),
      close: new Array(0)
    };

    init();
    return {
      onReady : onMessage('ready'),
      onData  : onMessage('data'),
      onClose : onMessage('close'),
      sendData: sendData
    };

    function init(){
      window.addEventListener("message", function(msg){
        if(msg.data.type && listeners[msg.data.type]){
          listeners[msg.data.type].forEach(function(fn){
            fn(msg.data.data);
          });
        }
      });
    }

    function onMessage(type){
      return function(callback){
        listeners[type].push(callback);
      };
    }

    function sendData(iframe, data){
      iframe.postMessage(data, '*');
    }
  } // end main

  function iframe(){
    var dataListeners = new Array(0);

    init();
    return {
      ready   : message('ready'),
      onData  : onData,
      sendData: sendData,
      close   : message('close')
    };

    function init(){
      window.addEventListener("message", function(event){
        dataListeners.forEach(function(fn){
          fn(event.data);
        });
      });
    }

    function message(type){
      return function(){
        window.parent.postMessage({
          type: type,
          'location': window.location.href
        }, '*');
      };
    }

    function onData(callback){
      dataListeners.push(callback);
    }

    function sendData(data){
      window.parent.postMessage({
        type: 'data',
        data: data,
        location: window.location.href
      }, '*');
    }
  } // end iframe


})();

console.log('koappComm', koappComm);
