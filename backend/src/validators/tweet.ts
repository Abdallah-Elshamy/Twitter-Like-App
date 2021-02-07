import validator from "validator";

interface TweetInput {
    text: string;
    mediaURLs: string[];
}

const tweetValidator = (tweetInput: TweetInput) => {
    const { text, mediaURLs } = tweetInput;
    const validators: { message: string; value: string }[] = [];
    if (
        !validator.isLength(text, {
            min: 1,
            max: 280,
        })
    ) {
        //when no text in the tweet but it contains media it will pass
        if(!(text.length < 1 && (mediaURLs !== undefined && mediaURLs.length != 0))) {
            validators.push({
                message: "text length must be between 1 to 280 chars!",
                value: "text",
            });
        }    
    }
    if (mediaURLs !== undefined && mediaURLs.length > 4) {
        validators.push({
            message: "mediaURLs array must not exceed 4 urls!",
            value: "mediaURLs",
        });
    }
    if(mediaURLs !== undefined) {
        for(let mediaURL of mediaURLs) {
            if(!validator.isURL(mediaURL)) {
                validators.push({
                    message: "all mediaURLs must be valid urls!",
                    value: "mediaURLs",
                });
                break;
            }
        }
    }
    return validators;
};

export default tweetValidator;
