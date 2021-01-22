import Validator from "validator";

interface TweetInput {
    text: string;
    mediaURLs: string[];
}

const tweetValidator = (tweetInput: TweetInput) => {
    const { text, mediaURLs } = tweetInput;
    const validators: { message: string; value: string }[] = [];
    if (
        !Validator.isLength(text, {
            min: 1,
            max: 280,
        })
    ) {
        validators.push({
            message: "text length must be between 1 to 280 chars!",
            value: "text",
        });
    }
    if (mediaURLs !== undefined && mediaURLs.length > 4) {
        validators.push({
            message: "mediaURLs array must not exceed 4 urls!",
            value: "mediaURLs",
        });
    }
    return validators;
};

export default tweetValidator;
