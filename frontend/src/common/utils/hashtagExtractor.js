"use strict";
exports.__esModule = true;
exports.hashtagExtractor = void 0;
function isAlpha(ch) {
    return /^[A-Z_]$/i.test(ch);
}
function swapHash(hash) {
    return "<span className=\"text-blue-500 pointer hover:text-blue-400\" \n  onClick={()=>gotoHashtag(" + hash + ")} >\n  " + hash + "\n  </span>";
}
function hashtagExtractor(tweet) {
    //flag indecates if wee are in hashtag
    var hashtags = new Set();
    for (var i = 0; i < tweet.length; i++) {
        if (tweet[i] === '#') {
            var start = i;
            while (isAlpha(tweet[i])) {
                i++;
            }
            hashtags.add(tweet.substr(start, i));
        }
    }
    hashtags.forEach(function (hash) {
        tweet = tweet.replace(hash.toString(), swapHash(hash));
    });
    return tweet;
}
exports.hashtagExtractor = hashtagExtractor;
;
console.log(hashtagExtractor("eslam #rslam #sad #eslam #sad"));
