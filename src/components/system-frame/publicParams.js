/**
 * store相关参数
 */
export const storeParams = {
  storeModuleName: 'systemFrame', //store的模块名称
};

/**
 * 全部布局相关参数
 * @type {{topHeaderHeight: number}}
 */
export const layoutParams = {
  topHeaderHeight: 54, //顶部header的高度
  siderExpandWidth: 140, //侧边栏拉出来的宽度
};
//系统编号
export const SYSTEM_NOS = {
  Web_Angular_Url: 998, //web angular 中其他的url
  Web_Angular_Video: 999, //web angular video系统
  Web_Angular: 1000, //web angular系统
  Web_Boss: 1001, //boss系统
  Web_Ea: 1002, //新web业务系统，web angular的升级系统
  Web_Workcircle: 1003, //工作圈
  Web_Datav: 1004, //datav系统
  Web_Face: 1005, //人脸会员系统
};
//消息上报类型
export const msgType = {
  CRN: 'Check_Result_Notify', //点检完成后的通知--
  CTN: 'Check_Task_Notify', //点检任务通知
  CFN: 'Check_FeedBack_Notify', //整改反馈通知--
  CRNN: 'Check_Rectify_NOT_Notify', //复检不通过通知
  CRON: 'Check_Rectify_OK_Notify', //复检通过通知
  PCN: 'Problem_Capture_Notify',
  PFN: 'Problem_FeedBack_Notify',
  PRNN: 'Problem_Rectify_NOT_Notify', //新问题
  CPP: 'com.kedacom.shop.po.PictureInfo',
  PSN: 'Pic_Share_Notify', //图片分享通知
  DAN: 'Department_available_Notify', //门店到期通知
  FBN: 'Feedback_Notify', //意见反馈通知
  DEVAN: 'Device_Alert_Notify', //告警通知--
  PAN: 'Problem_available_Notify', //问题到期通知--
  PCCN: 'Problem_Carboncopy_Notify', //问题抄送通知--
  HBN: 'Handover_Book_Notify', //工作圈通知--
  SSN: 'STATISTICS_SUBSCRIPTION_NOTIFY', //巡店订阅报告通知--
  SPN: 'STATISTICS_PERSON_NOTIFY', //巡店个人报告通知--
  CTRN: 'CHECK_TEMP_REPORT_NOTIFY', //巡审核店报告--
  SDN: 'STATISTICS_DEPT_NOTIFY', //巡店门店报告通知--
  Secretary: 'Small_Secretary_Notify', //小秘书消息--
};

/**
 * websocket系统事件类型定义
 */
export const WEBSOCKET_EVENT_TYPE = {
  MSG_RECEIVE: 1000, //收到一般系统消息
  MSG_BROADCAST: 1002, //广播消息
  MSG_EXPORTOK: 1001, //收到下载完成消息
  MSG_SESSIONINVALID: 1004, //session到期提醒消息
  MSG_READED: 1005, //消息状态改变通知
  FACE_IMGPUSH: 9000, //人脸照片通知
  MSG_OVOSTATION: 8009, //电视墙图片
  MSG_WECHAT : 2019,        //微信支付，用于计费
};
/**
 * 事件总线事件类型
 */
export const EVENTBUS_TYPE = {
  SYSTEM_BROADCAST: 'SYSTEM_BROADCAST',
  REFRESH_MSG: 'REFRESH_MSG',
  PWD_POWER: 'PWD_POWER', //密码强度
  OVOSTATION_MSG: 'OVOSTATION_MSG',
  DEFAULT_EMIT:'DEFAULT_EMIT',//其他统一类型推送
  PAY_WECHAT:'PAY_WECHAT'          //微信支付
};

//定义数字相关的
export const NUMBER_GLOBAL = {
  messageNumber: 5, //系统消息显示的个数
};
