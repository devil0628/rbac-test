import { getLanguage, getToken } from './common/js/ovoSystem';
import { addClass, removeClass, deepCopy, getAttributesStrFromArray } from './common/js/utils';


import { getHeaderLanguage } from './api/request';

const utils = {};
utils.version = '1.0';

utils.addClass = addClass;
utils.removeClass = removeClass;
utils.deepCopy = deepCopy;
utils.getAttributesStrFromArray = getAttributesStrFromArray;

utils.getLanguage = getLanguage;
utils.getToken = getToken;






utils.getHeaderLanguage = getHeaderLanguage;

Object.freeze(utils);
export default utils;
