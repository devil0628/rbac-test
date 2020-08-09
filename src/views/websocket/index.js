import { mapState } from 'vuex';
import logout from '../../utils/logout';
import { getWebSocketId } from '../../../../common/js/ovoSystem';
import { storeParams, WEBSOCKET_EVENT_TYPE, EVENTBUS_TYPE } from '../../publicParams';
export default {
  computed: {
    ...mapState(storeParams.storeModuleName, ['servers', 'token']),
  },
  mounted() {
    this.listen();
  },
  methods: {
    initWebsocket() {
      let wsId = getWebSocketId(); //确保有此webSocketId，webSocketId是从登录页拿的
      let wsUrl = `${this.servers.websocketServerUrl}?token=${this.token}&version=2.0&client=web&webSocketId=${wsId}`;
      this.$connect(wsUrl, this);
      //this.$socket.send('some data')
    },
    listen() {
      this.$options.sockets.onmessage = data => {
        let json = JSON.parse(data.data);
        let msgType = +json.msgType;
        switch (msgType) {
          case WEBSOCKET_EVENT_TYPE.MSG_BROADCAST:
            this.systemBroadcast(json.msg);
            break;
          case WEBSOCKET_EVENT_TYPE.MSG_SESSIONINVALID:
            this.sessionOut(json.msg);
            break;
          case WEBSOCKET_EVENT_TYPE.MSG_READED:
          case WEBSOCKET_EVENT_TYPE.MSG_RECEIVE:
            this.refreshMsg();
            break;
          case WEBSOCKET_EVENT_TYPE.MSG_OVOSTATION:
            this.getImage(json.msg);
            break;
            case WEBSOCKET_EVENT_TYPE.MSG_WECHAT:
            this.sendPaySuccess(json.msg);
              break;
          default:
            this.defaultNotify(json);
        }
      };
    },
    //系统广播消息
    systemBroadcast(data) {
      this.$eventbus.$emit(EVENTBUS_TYPE.SYSTEM_BROADCAST, data);
    },
    sessionOut() {
      alert(this.$t('system.sessionout'));
      logout();
    },
    refreshMsg() {
      //刷新消息列表
      this.$eventbus.$emit(EVENTBUS_TYPE.REFRESH_MSG);
    },
    getImage(data) {
      this.$eventbus.$emit(EVENTBUS_TYPE.OVOSTATION_MSG, data);
    },
      sendPaySuccess(data) {
      this.$eventbus.$emit(EVENTBUS_TYPE.PAY_WECHAT, data);
    },
    //其他所有未定义的类型推送
    defaultNotify(json){
      this.$eventbus.$emit(EVENTBUS_TYPE.DEFAULT_EMIT, json);
    }
  },
};
