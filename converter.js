const inputField = document.getElementById('input-temp');
const fromUnitField = document.getElementById('input-unit');
const toUnitField = document.getElementById('output-unit');
const outputField = document.getElementById('output-temp');
const form = document.getElementById('converter');

function convertTemp(value, fromUnit, toUnit) {
    if (fromUnit === 'c') {
        if (toUnit === 'f') {
            return value * 9 / 5 + 32;
        } else if (toUnit === 'k') {
            return value + 273.15;
        }
        return value;
    }
    if (fromUnit === 'f') {
        if (toUnit === 'c') {
            return (value - 32) * 5 / 9;
        } else if (toUnit === 'k') {
            return (value + 459.67) * 5 / 9;
        }
        return value;
    }
    if (fromUnit === 'k') {
        if (toUnit === 'c') {
            return value - 273.15;
        } else if (toUnit === 'f') {
            return value * 9 / 5 - 459.67;
        }
        return value;
    }
    throw new Error('Invalid unit');
}

form.addEventListener('input', () => {
    const inputTemp = parseFloat(inputField.value);
    const fromUnit = fromUnitField.value;
    const toUnit = toUnitField.value;

    const outputTemp = convertTemp(inputTemp, fromUnit, toUnit);
    outputField.value = (Math.round(outputTemp * 100) / 100) + ' ' + toUnit.toUpperCase();
});

function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
        // 這裡result只會有兩種結果：一個是用戶允許(granted)，另一個是用戶封鎖(denied)
        console.log('User Choice', result);
        if (result !== 'granted') {
            console.log('No notification permission granted!');
        } else {
            displayConfirmNotification();
        }
    });
}


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
