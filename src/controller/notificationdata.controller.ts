import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import SaveNotificationSchema from "../models/SaveNotificationSchema";
import CustomerProfile from "../models/CustomerProfile";
import UserChatMessageSaveForAdmin from "../models/UserChatMessageSaveForAdmin";
import AdminChatMessageSaveForAdmin from "../models/AdminChatMessageForUser";


const getNotificationData = asyncHandler( async (req: Request, res: Response) => {
    try {
            const { userId } = req.params;
            const notifications = await SaveNotificationSchema.aggregate([
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
          time:1
        },
      },
    ]);
    
            if (!notifications || notifications.length === 0) {
                return res.status(404).json({ message: 'No notifications found' });
            }
    
            res.status(200).json({ message: 'Notification data retrieved', data: notifications });
        } catch (error:any) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
})


const sendNotificationCustomerProfile = asyncHandler( async (req: Request, res: Response) => {
    try {
        const { senderId } = req.params;
        const HARD_CODED_ID = '6825e7123d8cff36ca7afe9b'; // হার্ডকোডেড আইডি
    
        // ইনপুট ভ্যালিডেশন
        if (!senderId) {
          return res.status(400).json({ success: false, error: 'Sender ID is required' });
        }
    
        // senderId এবং হার্ডকোডেড আইডি ম্যাচ চেক
        if (senderId === HARD_CODED_ID) {
          const profiles = await CustomerProfile.aggregate([
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
    ]); // সব প্রোফাইল ফেচ করা
          if (!profiles || profiles.length === 0) {
            return res.status(404).json({ success: false, error: 'No profiles found' });
          }
          return res.status(200).json({ success: true, data: profiles });
        } else {
          return res.status(403).json({ success: false, error: 'Unauthorized: Sender ID does not match' });
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
      }
})


const customerMessageForAdmin = asyncHandler( async (req: Request, res: Response) => {
    const {customerId} = req.params;
    
      if(!customerId){
        res.status(404).json({message: 'customer id is required'})
      }
    
      try {
        const customerMessage = await UserChatMessageSaveForAdmin.find({senderId: customerId});
        if(!customerMessage){
          return res.status(404).json({ success: false, error: 'No message found' });
        }
    
        res.status(200).json({message: 'Found messages', data:customerMessage})
      } catch (error) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch profiles' });
      }
})


const adminMessageForCustomer = asyncHandler(async (req: Request, res: Response) => {
    const { adminId, userid } = req.query;
  console.log(adminId, userid);

  if (!userid || !adminId) {
    return res.status(404).json({ message: 'user id is required' });
  }

  try {
    const adminMessage = await AdminChatMessageSaveForAdmin.aggregate([
      {
        $match: {
          $or: [
            { senderId: adminId },
            { senderId: userid },
            { receiverId: adminId },
            { receiverId: userid }
          ]
        }
      },
      {
        $sort: { createdAt: 1 } // 1 = Ascending (Old → New), use -1 for descending
      }
    ]);

    if (!adminMessage || adminMessage.length === 0) {
      return res.status(404).json({ message: 'Messages Data not found' });
    }

    res.status(200).json({ message: 'admin message found', data: adminMessage });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
})

export {
    getNotificationData,
    sendNotificationCustomerProfile,
    customerMessageForAdmin,
    adminMessageForCustomer
}