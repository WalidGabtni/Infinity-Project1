import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserfriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemovefriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
            friend.friends = friend.friends.filter((friend) => friend.toString() !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await User.find({ _id: { $in: user.friends } });

        res.status(200).json({ friends });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE - Add bookmarked post to user's bookmarks */
export const addRemoveBookmark = async (req, res) => {
    try {
        const { id, postId } = req.params;
        const user = await User.findById(id);

        // Check if the post is already bookmarked
        const isBookmarked = user.bookmarks.includes(postId);

        if (isBookmarked) {
            // If bookmarked, remove it
            user.bookmarks = user.bookmarks.filter((bookmark) => bookmark.toString() !== postId);
        } else {
            // If not bookmarked, add it
            user.bookmarks.push(postId);
        }

        await user.save();

        res.status(200).json({ bookmarks: user.bookmarks });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
