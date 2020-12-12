
var startTime;
var stopTime;

var timerId;

//停止フラグ
var isStop;

var gmtOffset;

//タイマーリセット
function resetInterval() {
    'use strict';
    
    if (timerId) {
        clearInterval(timerId);
    }
    timerId = null;
}

//リセット
function resetTimer() {
    'use strict';
    
    isStop = true;
    document.getElementById('start').value = 'start';
    document.getElementById('time').innerHTML = "00:00:00.000";
    startTime = null;
    stopTime = null;
    resetInterval();
}

//描画
function drawTimer(hour, min, sec, ms) {
    'use strict';

    var strHour = ('00' + (hour + gmtOffset)).slice(-2);
    var strMin  = ('00' + min).slice(-2);
    var strSec  = ('00' + sec).slice(-2);
    var strMs   = ('000' + ms).slice(-3);

    document.getElementById('time').innerHTML = strHour + ':' + strMin + ':' + strSec + ':' + strMs;
}

//時間計算
function calcTimer() {
    'use strict';

    //差分
    var nowTime = Date.now();
    var timeDiff = new Date(nowTime - startTime);

    //描画用時間計算
    var ms = timeDiff.getMilliseconds();
    var sec = timeDiff.getSeconds();
    var min = timeDiff.getMinutes();
    var hour = timeDiff.getHours();

    //描画
    drawTimer(hour, min, sec, ms);
}

//スタート・ストップ
function changeTimerState() {
    'use strict';
    
    //開始
    if (isStop) {
        document.getElementById('start').value = 'stop';
        //開始
        if (!stopTime) {
            startTime = Date.now();
        }
        //再開
        else {
            var nowTime = Date.now();
            var elapsedTime = nowTime - stopTime;
            startTime = new Date(startTime + elapsedTime);
        }
        
        //計測開始
        timerId = setInterval(calcTimer, 10);
    }
    //停止
    else {
        document.getElementById('start').value = 'start';
        stopTime = Date.now();

        //計測停止
        resetInterval();
    }

    //フラグ切り替え
    isStop ^= 1;
}

//画面読み込み時の処理
window.onload = function() {
    'use strict';
    
    gmtOffset = new Date().getTimezoneOffset() / 60;
    resetTimer();
}