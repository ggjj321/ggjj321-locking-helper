var channelToken = 'your channel token';
//回覆訊息 不用錢
function replyMsg(replyToken, userMsg, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{'type': 'text', 'text': userMsg}]
    })
  };
  UrlFetchApp.fetch(url, opt);
}
// 發送訊息 要錢
function pushMsg(channelToken, message, usrId) {
  var url = 'https://api.line.me/v2/bot/message/push';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': usrId,
      'messages': [{'type': 'text', 'text': message}]
    })
  };
  UrlFetchApp.fetch(url, opt);
}

// 群組定時訊息通知
function sendGroup(message) {
  var groupId = '群組id';
  var url = 'https://api.line.me/v2/bot/message/push';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': groupId,
      'messages': [{'type': 'text', 'text': message}]
    })
  };
  UrlFetchApp.fetch(url, opt);
}
function newYear() {
  sendGroup('大家新年快樂');
}
// // e 是Line 給我們的資料
function doPost(e) {
  var url = '表單連結';
  var name = '工作表1';
  var SpreadSheet = SpreadsheetApp.openByUrl(url);
  var SheetName = SpreadSheet.getSheetByName(name);
  var talkCase = SheetName.getRange(1, 2).getValue();
  // 工作表
  var value = JSON.parse(e.postData.contents);
  try {
    var events = value.events;
    if (events != null) {
      for (var i in events) {
        var event = events[i];
        var type = event.type;
        var replyToken = event.replyToken; // 要回復訊息 reToken
        var sourceType = event.source.type;
        var sourceId = LineHelpers.getSourceId(event.source);
        var userId = event.source.userId; // 取得個人userId
        var groupId = event.source.groupId; // 取得群組Id
        var timeStamp = event.timestamp;
        switch (type) {
          case 'postback':
            break;
          case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text; // 使用者的 Message_字串
            if(talkCase == 'a'){
              switch(messageText){
                case('群組id'):
                  pushMsg(channelToken, groupId, sourceId);
                  break;
                case('使用者id'):
                  pushMsg(channelToken, userId, sourceId);
                  break;
                case('請假表單'):
                  replyMsg(replyToken, '表單連結', channelToken);
                  break;
                case('排舞歌'):
                  replyMsg(replyToken, 'spotify 連結', channelToken);
                  break;
                case('歐陽歌單'):
                  replyMsg(replyToken, 'spotify 連結', channelToken);
                  break;
                case('笑話'):
                  var getLastRow = SheetName.getLastRow();
                  var index = Math.floor(Math.random() * (getLastRow)) + 1;
                  var range = SheetName.getRange(index, 1);
                  var value = range.getValue();
                  replyMsg(replyToken, value, channelToken);
                  break;
                case('講笑話'):
                  SheetName.getRange(1, 2).setValue('b');
                  replyMsg(replyToken, 'ㄌㄩㄝ，請說', channelToken);
                  break;
                case('小幫手'):
                  var data = '請嘗試以下關鍵字:\n請假表單\n排舞歌\n歐陽歌單\n笑話\n講笑話\n\\請務必輸入要一模一樣喔/';
                  replyMsg(replyToken, data, channelToken);
                  break;
                case('耶誕'):
                  var data = '聖誕';
                  replyMsg(replyToken, data, channelToken);
                  break;
                case('新年快樂'):
                  var data = '大家新年快樂，請適量飲酒';
                  replyMsg(replyToken, data, channelToken);
                  break;
              } 
              if(messageText.indexOf('耶誕')>-1){
                var data = '聖誕';
                replyMsg(replyToken, data, channelToken);
              }
            }
            else if(talkCase == 'b'){
              var getLastRow = SheetName.getLastRow();
              SheetName.getRange(getLastRow+1, 1).setValue(messageText);
              SheetName.getRange(1, 2).setValue('a');
            }
            break;
          case 'join':
            pushMsg(channelToken, '我是Bot！Hello！', sourceId);
            break;
          case 'leave':
            pushMsg(channelToken, 'Good Bye！', sourceId);
            break;
          case 'memberLeft':
            pushMsg(channelToken, '我是Bot！Bye！', sourceId);
            break;
          case 'memberJoined':
            pushMsg(channelToken, '我是Bot！Hello~', sourceId);
            break;
          case 'follow':
            pushMsg(channelToken, 'Hello！', sourceId);
            break;
          case 'unfollow':
            pushMsg(channelToken, 'Bye bye！', sourceId);
            break;
          default:
            break;
        }
      }
    }
  } catch(ex) {
    console.log(ex);
  }
}
function doGet(e) {
  var url = '表單連結';
  var name = '工作表1';
  var SpreadSheet = SpreadsheetApp.openByUrl(url);
  var SheetName = SpreadSheet.getSheetByName(name);
  var talkCase = SheetName.getRange(1, 2).getValue();
  console.log(talkCase);
}
var LineHelpers = (function (helpers) {
  'use strict';
  helpers.getSourceId = function (source) {
    try {
      switch (source.type) {
        case 'user':
          return source.userId;
          break;
        case 'group':
          return source.groupId;
          break;
        case 'room':
          return source.roomId;
          break;
        default:
          console.log('LineHelpers, getSourceId, invalid source type!');
          break;
      }
    } catch (ex) {
      console.log('LineHelpers, getSourceId, ex = ' + ex);
    }
  }; 
  return helpers;
})(LineHelpers || {});