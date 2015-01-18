/**
 * Created by chernikovalexey on 1/18/15.
 */

var platform_vk = {};

platform_vk.getUserObject = function (user) {
    return {
        id: 0,
        first_name: '',
        last_name: '',
        link: '',
        photo_url: ''
    };
};

platform_vk.saveFriends = function () {
    VK.api("friends.get", {fields: "domain, photo_100"}, function (data) {
        console.log(data.response);
    });
};

$.extend(platform, platform_vk);