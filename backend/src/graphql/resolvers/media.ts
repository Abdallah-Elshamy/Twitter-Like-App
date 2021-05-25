import validator from "validator";
import { getUploadUrl, deleteMedia } from "../../storage/mediaAccess";
import { v4 } from "uuid";

export default {
    Query: {
        getUploadURL: async (
            parent: any,
            args: { isVideo: boolean },
            context: any,
            info: any
        ) => {
            const folder = args.isVideo ? "videos/": "images/" 
            const url: string = await getUploadUrl(folder + v4());
            if (!validator.isURL(url)) {
                const error: any = new Error(
                    "An error happened while getting the URL!"
                );
                error.statusCode = 500;
                throw error;
            }
            return url;
        },
    },
    Mutation: {
        deleteMedia: async (
            parent: any,
            args: { id: string },
            context: any,
            info: any
        ) => {
            return deleteMedia(args.id);
        },
    },
};
