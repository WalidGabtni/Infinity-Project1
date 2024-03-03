import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch(err) {
        res.status(404).json({message: err.message})
    }
}

export const getUserfriends = async (req, res) => {
    try{
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
    } catch (err){
        res.status(404).json({ message: err.message });
    }
};


/* UPDATE */
export const addRemovefriend = async (req, res) => {
    try{

        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        }else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, pricturePath }) => {
                return { _id, firstName, lastName, occupation, location, pricturePath };
            }
        );

        res.status(200).json(formattedFriends);
        
    } catch (err){
        res.status(404).json({ message: err.message });
    }
}

/*ADD AND REMOVE BOOKMLARK */

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

/* READ - Get all bookmarked posts of the logged-in user */
export const getBookmarkedPosts = async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user's ID is in the URL parameters
        const user = await User.findById(userId);

        const bookmarkedPosts = user.bookmarks || [];
        
        res.status(200).json(bookmarkedPosts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};