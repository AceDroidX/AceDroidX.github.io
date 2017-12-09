/*
==UserScript==
@name           bilibili-live-auto-chest
@description    自动提醒bilibili直播宝箱领取
@author         wxx
@copyright      2017+, wxx
@version        1.0.0
@icon           https://avatars1.githubusercontent.com/u/15519693
@include        http*://live.bilibili.com/*
@grant          none
@namespace      https://github.com/wangxuxin/wangxuxin.github.io
@homepageURL    https://github.com/wangxuxin/wangxuxin.github.io
==/UserScript==

bilibili-live-auto-chest.js
自动提醒bilibili直播宝箱领取

食用方法：
方法一：
Chrome按F12打开控制台(Console)将该脚本全部复制进去再回车
方法二：
新建书签，在网址栏里输入javascript:后再将该脚本全部复制到后面
方法三(推荐)：
把该脚本导入油猴(tampermonkey)

提示元素获取失败：
Chrome右击宝箱下方的时间，点击审查元素，在弹出的元素(时间元素)中添加属性 id="chestTime"

2017.12.09    v1.0.0
By wxx
https://wangxuxin.github.io
*/
var pattern = /^[0-5]?\d:[0-5]?\d$/g;
var maxfail = 2;
var retrytime = 5000;
/*temp var*/
var failcount = 0;
var timeobject1;
var timeobject2;
var ontime = false;
var onalert = false;
var isloop = false;

function loop() {
    /*console.log("test1\n" + ontime + "\n" + onalert)*/
    if (chestTime.innerHTML == "00:00") {
        if (!onalert) {
            ontime = true;
            /*console.log("test2\n" + ontime + "\n" + onalert);*/
        }
    }
    if (chestTime.innerHTML != "00:00") {
        if (onalert) {
            ontime = false;
            onalert = false;
            /*console.log("test3\n" + ontime + "\n" + onalert)*/
        } else {
            /*console.log("test4\n" + ontime + "\n" + onalert)*/
        }
    }
    if (ontime == true && onalert == false) {
        alert("宝箱领取时间到 ε٩(๑> ₃ <)۶з");
        onalert = true;
        /*console.log("test5\n" + ontime + "\n" + onalert)*/
    }
    timeobject1 = setTimeout(function(){loop();}, 1000);
}
/*verify – 校验一个字符串是否符合某种模式
 *str – 要进行校验的字符串
 *pat – 与patterns中的某个正则表达式模式对应的属性名称
 */
function verify(str, pat) {
    if (pat.test(str)) {
        return true;
    } else {
        return false;
    }
}

function startloop() {
    if (!(typeof chestTime === 'undefined')) {
        loop();
        isloop = true;
        console.log("auto-chest:enable");
        return true;
    } else {
        var nodes = document.all;
        for (var i = 0; i < nodes.length; i++) {
            var o = nodes[i];
            if (verify(o.innerHTML, pattern)) {
                o.id = "chestTime";
                loop();
                isloop = true;
                console.log("auto-chest:enable");
                return true;
            }
        }
    }
    failcount++;
    console.log("auto-chest:fail " + failcount);
    if (failcount < maxfail) {
        timeobject2 = setTimeout(function(){startloop();}, retrytime);
    } else {
        console.log("auto-chest:disable");
        alert("Σ(;ﾟдﾟ) 元素获取失败，请手动添加属性 id=\"chestTime\"");
        return false;
    }
}
/*主程序*/
function main() {
    console.log("bilibili-live-auto-chest\nBy wxx");
    startloop();
}
main();