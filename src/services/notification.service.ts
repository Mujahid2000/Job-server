import SaveNotificationSchema from "../models/SaveNotificationSchema";
import CustomerProfile from "../models/CustomerProfile";
import UserChatMessageSaveForAdmin from "../models/UserChatMessageSaveForAdmin";
import AdminChatMessageSaveForAdmin from "../models/AdminChatMessageForUser";
import NotificationSchema from "../models/NotificationSchema"; // Correctly import the schema
import { ApiError } from "../utils/ApiError";

const getNotificationData = async (userId: string) => {
    return await SaveNotificationSchema.aggregate([
        {
            $match: {
                applicantId: `${userId}`,
            },
        },
        {
            $lookup: {
                from: "companydatas",
                localField: "companyUser",
                foreignField: "userId",
                as: "result",
            },
        },
        {
            $unwind: {
                path: "$result",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                companyName: "$result.companyName",
            },
        },
        {
            $project: {
                id: 1,
                applicantId: 1,
                jobId: 1,
                message: 1,
                Name: 1,
                companyUser: 1,
                companyName: 1,
                time: 1
            },
        },
    ]);
};

const getCustomerProfilesForAdmin = async (senderId: string) => {
    const HARD_CODED_ID = '69c015484aa82ad8094f5115';
    if (senderId !== HARD_CODED_ID) {
        throw new ApiError(403, 'Unauthorized: Sender ID does not match');
    }

    return await CustomerProfile.aggregate([
        {
            $lookup: {
                from: "applicants",
                localField: "senderId",
                foreignField: "userId",
                as: "customer",
            },
        },
        {
            $unwind: {
                path: "$customer",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $set: {
                name: "$customer.fullName",
                picture: "$customer.profilePicture",
            },
        },
        {
            $project: {
                name: 1,
                picture: 1,
                email: 1,
                senderId: 1,
            },
        },
    ]);
};

const getCustomerMessagesForAdmin = async (customerId: string) => {
    return await UserChatMessageSaveForAdmin.find({ senderId: customerId });
};

const getAdminMessagesForCustomer = async (adminId: string, userId: string) => {
    return await AdminChatMessageSaveForAdmin.aggregate([
        {
            $match: {
                $or: [
                    { senderId: adminId },
                    { senderId: userId },
                    { receiverId: adminId },
                    { receiverId: userId }
                ]
            }
        },
        {
            $sort: { createdAt: 1 }
        }
    ]);
};

const sendNotification = async (notificationData: any, io: any) => {
    const { applicantId, type } = notificationData;

    const userNotificationStatus = await NotificationSchema.findOne({ userId: applicantId });
    if (!userNotificationStatus) {
        throw new ApiError(404, 'No notification record found for this user');
    }

    const isAllowed = type === 'shortlist'
        ? userNotificationStatus.shortlist
        : userNotificationStatus.savedProfile;

    if (!isAllowed) {
        return null; // or throw a custom error if you want to differentiate
    }

    const notification = {
        ...notificationData,
        time: new Date(),
    };

    await SaveNotificationSchema.create(notification);
    io.to(applicantId).emit('receiveNotification', notification);
    return notification;
};

const customerMessage = async (msgDataBody: any, io: any) => {
    const { _id, createdAt, updatedAt, __v, ...safeMsgBody } = msgDataBody;
    const { senderId, name, email, receiverId } = safeMsgBody;

    const msgData = {
        ...safeMsgBody,
        dateWithTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    };

    let findProfile = await CustomerProfile.findOne({ senderId });
    if (!findProfile) {
        const saveCustomerProfile = new CustomerProfile({ senderId, name, email });
        await saveCustomerProfile.save();
    }

    io.to(receiverId).emit('message', msgData);
    const saveUserMessage = new AdminChatMessageSaveForAdmin(msgData);
    await saveUserMessage.save();

    return msgData;
};

export const notificationService = {
    getNotificationData,
    getCustomerProfilesForAdmin,
    getCustomerMessagesForAdmin,
    getAdminMessagesForCustomer,
    sendNotification,
    customerMessage,
};
