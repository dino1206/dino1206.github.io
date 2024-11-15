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

if ('Notification' in window) {
    for (var i = 0; i < enableNotificationButtons.length; i++) {
        enableNotificationButtons[i].style.display = 'inline-block';
        enableNotificationButtons[i].addEventListener('click', askForNotificationPermission);
    }
}

function displayConfirmNotification() {
    if ('serviceWorker' in navigator) {
        var options = {
            body: '您已成功訂閱我們的推播服務!'
        }
        navigator.serviceWorker.ready.then(function (swreg) {
            swreg.showNotification('成功訂閱!! (from Service Worker)', options);
        });
    }
}