window.addEventListener('load', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
                // firebase methods，用同一支sw.js
                messaging.useServiceWorker(reg);
            })
            // 註冊失敗
            .catch(function (err) {
                console.log('error: ', err);
            });
    }

    messaging.requestPermission().then(function () {

        // 先判斷cookies有沒有token，沒有再取token
        var ckv = document.cookie.replace(/(?:(?:^|.*;\\s*)augustusWsPush\s*\=\s*([^;]*).*$)|^.*$/, "$1") || null;

        // cookies不存在，跟使用者要求通知權限
        if (ckv === null) {
            // 拿到token，firebase-messaging-sw.js 就會存 Service Workers 裡
            messaging.getToken().then(function (currentToken) {

                // token存至firebase
                var id = currentToken.split(':')[0];
                firebase.database().ref('pushUsers/' + id).set({ 'token': currentToken });

                // token存至cookies
                document.cookie = "augustusWsPush=" + currentToken;

            });
        }
        // cookies 已存在，從 cookies 取出後傳至 firebase
        else {
            var id = ckv.split(':')[0];
            firebase.database().ref('pushUsers/' + id).set({ 'token': ckv });
        }

    }).catch(function (err) {
        console.log('使用者未允許通知', err);
    });

});