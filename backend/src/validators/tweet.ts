import Validator from "validator";

interface TweetInput {
    text: string;
    state: string;
    mediaURL: string[];
}

const tweetValidator = (tweetInput: TweetInput) => {
    const { text, state, mediaURL } = tweetInput;
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
    if (state !== "O" && state !== "C" && state !== "R" && state !== "Q") {
        validators.push({
            message: "state must have the value of O or C or R or Q only!",
            value: "state",
        });
    }
    if (mediaURL !== undefined && mediaURL.length > 4) {
        validators.push({
            message: "mediaURL array must not exceed 4 urls!",
            value: "mediaURL",
        });
    }
    return validators;
};

export default tweetValidator;
