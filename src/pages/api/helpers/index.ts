//helper function that adds value to the channel's property photoURL

import { ObjMapper } from "../../../database/objectMapper";
import { User } from "../../../database/schema";
import { User as UserType, VideoCourse } from "../../../reusable/interfaces";

export async function normalizedCoursesWithTutorPhotoURL(
    videos: any[],
) {
    let clonedVideos: VideoCourse[] = [];
    const users: UserType[]  = await User.find({});
    const clonedUsers: UserType[] = [...ObjMapper(users)];

    if (users.length > 0 && videos.length > 0) {
        for (let vidIndex = 0; vidIndex < videos.length; vidIndex++) {
            const clonedVid = { ...videos[vidIndex]._doc };
            const clonedVidChannelProp = { ...clonedVid.author };
            if (videos[vidIndex]._id) {
                const user = clonedUsers.find(
                    (_user) => _user._id === videos[vidIndex]?.author?.authorId
                );
                clonedVidChannelProp.public_id = user?.imageAsset?.publicId;
                clonedVid.author = clonedVidChannelProp;
                clonedVideos.unshift(clonedVid);
            }
        }
    } else {
        return videos;
    }

    return clonedVideos;
}