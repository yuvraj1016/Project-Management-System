import User from "../mongodb/Schema/userSchema.js";
import { Types } from "mongoose";
import Notification from "../mongodb/Schema/notificationSchema.js";
import express from "express";
import Professor from "../mongodb/Schema/professorSchema.js";

const router = express.Router();

router.post("/add-notification", async (req, res) => {
    const body = {
        to: new Types.ObjectId(req.body.To),
        from: new Types.ObjectId(req.body.From),
        body: req.body.Body,
    }
    const Noti = await Notification(body);
    await Noti.save();
    res.status(201).json({ message: "Notification Sent" });
})
router.post("/update-notification", async (req, res) => {
    const Noti = await Notification.findByIdAndUpdate(
        { _id: req.body.Id },
        { $set: { read: true } },
        { new: true }
    );
    if (!Noti) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Notification Updated" });
    }
})
router.post("/get-notification", async (req, res) => {
    const user = await User.findById(req.body.user);
    const result = await Notification.find({ to: user._id });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Notification sent", notification: result });
    }
})
router.post("/send-notification", async (req, res) => {
    console.log(req);
    const Prof = await Professor.findOne({ email: req.body.Email })
    const user = await User.findById(req.body.From);
    const body = {
        to: new Types.ObjectId(Prof._id),
        from: new Types.ObjectId(user._id),
        body: `${user.firstName} ${user.lastName} with roll ${user.rollNumber} has Submitted the project. `,
    }
    if (Prof && user) {
        const Noti = await Notification(body);
        await Noti.save();
        res.status(201).json({ message: "Notification Sent" });
    }else{
        res.status(201).json({ flag: true });
    }
    
})
router.post("/prof-notification", async (req, res) => {
    const user = await Professor.findById(req.body.user);
    const result = await Notification.find({ to: user._id });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Notification sent", notification: result });
    }
})
export default router;