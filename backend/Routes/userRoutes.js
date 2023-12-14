import User from "./../mongodb/Schema/userSchema.js";
import express from 'express';
import multer from "multer";
import Professor from "../mongodb/Schema/professorSchema.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/user-signup", upload.single('userImage'), async (req, res, next) => {
    const body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        rollNumber: req.body.rollNumber,
        email: req.body.emailId,
        year: req.body.Year,
        semester: req.body.semester,
        section: req.body.sec,
        password: req.body.passWord,
        photo: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        branch: req.body.branch
    }
    const existingUser = await User.findOne({ email: req.body.emailId });
    const existingUser2 = await User.findOne({ rollNumber: req.body.rollNumber });
    if (existingUser || existingUser2) {
        res.status(201).json({ flag: true });
    } else {
        const user = new User(body);
        try {
            await user.save();
            res.status(201).json({ message: 'Student Created' });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
});
router.post("/user-details", async (req, res, next) => {
    const userId = req.body.id;
    const user = await User.findById(userId);
    console.log(user);
    if (user) {
        const body = {
            roll: user.rollNumber,
            photo: user.photo,
            first: user.firstName,
            last: user.lastName,
            year: user.year,
            semester: user.semester,
            submissionDate:user.submissionDate
        }
        res.status(201).json({ message: "User Details Coming your way", userDetails: body });
    } else {
        res.status(201).json({ flag: true });
    }
})

router.post("/user-login", async (req, res, next) => {
    const body = {
        rollNumber: req.body.roll,
        password: req.body.pass
    }
    const user = await User.findOne(body);
    if (user) {
        res.status(201).json({ message: "User authenticated", User: user._id });
    } else {
        res.status(201).json({ flag: true });
    }
});
router.get("/getall", async (req, res) => {
    const result = await User.find({});
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", user: result });
    }
});
router.post("/update-sup", async (req, res) => {
    try {
        const prof = await Professor.findById(req.body.supId);
        const result = await User.findOneAndUpdate(
            { _id: req.body.ID },
            {
                $set: {
                    supervisor: `${prof.firstName} ${prof.lastName}`,
                    supervisorEmail:prof.email
                }
            },
            { new: true }
        );
        if (!result) {
            res.status(201).json({ flag: true });
        } else {
            res.status(201).json({ message: "Project sent", user: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/update-date", async (req, res) => {
    try {
        const result = await User.updateMany(
            { year: req.body.year },
            {
                $set: 
                    {
                        submissionDate: new Date(req.body.Date)
                    }
                
            },
            { new: true }
        );
        if (!result) {
            res.status(201).json({ flag: true });
        } else {
            res.status(201).json({ message: "Project sent", user: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/get", async (req, res) => {
    try {
        const result = await User.find({supervisorEmail:req.body.sup})
        if (!result) {
            res.status(201).json({ flag: true });
        } else {
            res.status(201).json({ message: "Project sent", user: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;