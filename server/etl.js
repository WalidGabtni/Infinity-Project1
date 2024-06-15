import User from './models/User.js';
import Post from './models/Post.js';
import Project from './models/Project.js';
import Notification from './models/Notification.js';


function transformUsers(users) {
    return users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        picturePath: user.picturePath,
        location: user.location,
        occupation: user.occupation,
        viewedProfile: user.viewedProfile,
        impressions: user.impressions,
        bookmarks: user.bookmarks,
        role: user.role
        
    }));
}

function transformPosts(posts) {
    return posts.map(post => ({
        id: post._id,
        userId: post.userId,
        firstName: post.firstName,
        lastName: post.lastName,
        location: post.location,
        title: post.title,
        description: post.description,
        picturePath: post.picturePath,
        userPicturePath: post.userPicturePath,
        likes: post.likes,
        comments: post.comments.map(comment => ({
            userId: comment.userId,
            text: comment.text
        })),
        sharedBy: post.sharedBy,
        createdAt: post.createdAt 
    }));
}

function transformProjects(projects) {
    return projects.map(project => ({
        id: project._id,
        userId: project.userId,
        firstName: project.firstName,
        lastName: project.lastName,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        currentStatus: project.currentStatus,
        picturePath: project.picturePath,
        userPicturePath: project.userPicturePath,
        projectImage: project.projectImage,
        projectCover: project.projectCover,
        members: project.members.map(member => ({
            userId: member.userId,
            firstName: member.firstName,
            lastName: member.lastName,
            picturePath: member.picturePath,
            userPicturePath: member.userPicturePath,
            occupation: member.occupation,
            role: member.role
        })),
        pendingRequests: project.pendingRequests.map(request => ({
            userId: request.userId,
            notificationId: request.notificationId,
            firstName: request.firstName,
            lastName: request.lastName,
            picturePath: request.picturePath,
            userPicturePath: request.userPicturePath,
            occupation: request.occupation
        })),
        topics: project.topics.map(topic => ({
            userId: topic.userId,
            title: topic.title,
            content: topic.content,
            createdBy: topic.createdBy,
            locked: topic.locked,
            pinned: topic.pinned,
            hidden: topic.hidden,
            destination: topic.destination,
            createdAt: topic.createdAt,
            comments: topic.comments.map(comment => ({
                comment: comment.comment,
                createdBy: comment.createdBy
            }))
        })),
        privateTopics: project.privateTopics.map(topic => ({
            userId: topic.userId,
            title: topic.title,
            content: topic.content,
            createdBy: topic.createdBy,
            locked: topic.locked,
            pinned: topic.pinned,
            hidden: topic.hidden,
            destination: topic.destination,
            createdAt: topic.createdAt,
            comments: topic.comments.map(comment => ({
                comment: comment.comment,
                createdBy: comment.createdBy
            }))
        })),
        createdAt: project.createdAt
    }));
}

function transformNotifications(notifications) {
    return notifications.map(notification => ({
        id: notification._id,
        sender: notification.sender,
        recipient: notification.recipient,
        project: notification.project,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt
        
    }));
}


async function etl() {
    try {
        
        const [users, posts, projects, notifications] = await Promise.all([
            User.find(),
            Post.find(),
            Project.find(),
            Notification.find()
        ]);

        
        if (!users || !posts || !projects || !notifications) {
            throw new Error('Data not found');
        }

        
        const transformedUsers = transformUsers(users);
        const transformedPosts = transformPosts(posts);
        const transformedProjects = transformProjects(projects);
        const transformedNotifications = transformNotifications(notifications);

        
        return {
            users: transformedUsers,
            posts: transformedPosts,
            projects: transformedProjects,
            notifications: transformedNotifications
        };

    } catch (error) {
        console.error('Error performing ETL:', error);
        throw error;
    }
}


export { etl };
