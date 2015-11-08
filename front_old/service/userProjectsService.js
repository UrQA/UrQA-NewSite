/**
 * Created by karuana on 15. 7. 4..
 */

var NodeCache = require( "node-cache" );
var _ = require("underscore");

var IGNORE_LIST = [10];


var userProjectsService = function() {

    this.cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });


};

userProjectsService.prototype.getProjectInfo = function(userIdx, apiKey)  {


    if(_.contains(IGNORE_LIST, userIdx)) {
        //Api를통해 질의해서 무조건 데이터 넘기기
        return this.getProjectInfoForAdminUser(apiKey);
    }

    var cachedProjects = this.cache.get(userIdx.toString());

    if(_.isUndefined(cachedProjects)) {
        cachedProjects = this.syncProjectCache(userIdx);

        if(_.isNull(cachedProjects)) {
            return null;
        }
    }
    //TODO 캐쉬에 데이터가 없을때 혹시 모르니 사용자 정보를 한번 가져올 수 있도록 처리할것!
    var result = (!_.isUndefined(cachedProjects[apiKey])) ? cachedProjects[apiKey] : null;
    return result;

};

userProjectsService.prototype.syncProjectCache = function(userIdx) {
    var object = require('./UserSample.json');

    if(!_.isUndefined(object['projects'])){
        this.cache.set(userIdx.toString(), object['projects']);
    }

    return object['projects'];
    //실제로는 Rest 통신으로 데이터를 가져온다.
};

userProjectsService.prototype.getProjectInfoForAdminUser = function(apiKey) {
    var object = require('./AdminUserSample.json');
    return object;
}

module.exports = userProjectsService;
