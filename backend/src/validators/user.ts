import validator from "validator";

interface UserInput {
    userName: string;
    email: string;
    password: string;
    name: string;
    imageURL: string;
    coverImageURL: string;
}

const UserValidator = (userInput: UserInput) => {
    const {
        userName,
        email,
        password,
        name,
        imageURL,
        coverImageURL,
    } = userInput;
    const validators: { message: string; value: string }[] = [];

    // validate the email
    if (
        email !== undefined &&
        (!validator.isEmail(email) || validator.isEmpty(email))
    ) {
        validators.push({
            message: "Invalid email!",
            value: "email",
        });
    }
    // validate the display name
    if (
        name !== undefined &&
        (!validator.isEmpty(name) ||
            !validator.isLength(name, {
                min: 1,
                max: 50,
            }))
    ) {
        validators.push({
            message: "name must be between 1 and 50 characters long!",
            value: "name",
        });
    }
    // validate the userName
    if (
        userName !== undefined &&
        !validator.isLength(userName, {
            min: 4,
            max: 15,
        })
    ) {
        validators.push({
            message:
                "Username must be more than 4 characters long and can be up to 15 characters or less!",
            value: "userName",
        });
    }
    if (
        userName !== undefined &&
        !validator.matches(userName, /^[a-zA-Z0-9_]*$/i)
    ) {
        validators.push({
            message:
                "Username can contain only letters, numbers, and underscores—no spaces are allowed!",
            value: "userName",
        });
    }

    // validate the password
    if (
        password !== undefined &&
        !validator.isLength(password, {
            min: 8,
        })
    ) {
        validators.push({
            message: "Password must be equal or more than 8 characters long!",
            value: "password",
        });
    }
    // validate imageURL
    if (imageURL !== undefined && !validator.isURL(imageURL)) {
        validators.push({
            message: "Invalid image URL!",
            value: "imageURL",
        });
    }
    // validate coverImageURL
    if (coverImageURL !== undefined && !validator.isURL(coverImageURL)) {
        validators.push({
            message: "Invalid cover image URL!",
            value: "coverImageURL",
        });
    }
    return validators;
};

export default UserValidator;
