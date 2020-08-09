import { mapState } from 'vuex';
import { storeParams } from '../publicParams';

export const privileageAccess = {
  computed: {
    //是否是企业超级管理员或root
    isSuper() {
      return this.baseInfo.isSuper;
    },
    ...mapState(storeParams.storeModuleName, ['baseInfo', 'userInfo', 'privileges']),
  },
  created() {},
  methods: {
    registPrivilleageHanlder() {
      if (!this.$system || !this.$system.$auth) {
        throw new ReferenceError('没有在Vue.prototype上面定义$system方法或者$system.$auth对象');
      }
      //重新定义全局权限方法
      this.$system.$auth.isSuper = () => this.isSuper;
      this.$system.$auth.isRoot = this.isRoot;
      this.$system.$auth.isEnterpriseRoot = this.isEnterpriseRoot;
      Object.freeze(this.$system.$auth); //冻结$auth对象
    },
    /**
     * 判断是否是超级管理员
     * @returns {*}
     * @private
     */
    isRoot() {
      //判断是否为root
      return isRoot(this.baseInfo);
    },
    /**
     * 判断是否时企业超级管理员
     * @returns {*}
     * @private
     */
    isEnterpriseRoot() {
      return isEnterpriseRoot(this.baseInfo);
    },
  },
};
/**
 * 判断是否是代理商
 */
export const isAngency = function(baseInfo) {
  if (baseInfo.data && baseInfo.data.isAgency === 1) {
    return true;
  }
  return false;
};
/**
 * 判断是否为root
 */
export const isRoot = function(baseInfo) {
  return baseInfo.isSuper && !baseInfo.data.groupId;
};
/**
 * 判断是否是企业超级管理员或者root
 */
export const isEnterpriseRoot = function(baseInfo) {
  return baseInfo.isSuper || baseInfo.data.isAgency === 1; //代理商也考虑进来
};
