import multer from "multer";
import Professor from "../mongodb/Schema/professorSchema.js";
import User from "../mongodb/Schema/userSchema.js";
import Project from "../mongodb/Schema/postSchema.js";
import express from 'express';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/professor-signup", upload.single('userImage'), async (req, res, next) => {
    const body = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailId,
        password: req.body.passWord,
        photo: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        department: req.body.dept
    }
    const existingProfessor = await Professor.findOne({ email: req.body.emailId });
    if (existingProfessor) {
        res.status(201).json({ flag: true });
    } else {
        const Prof = new Professor(body);
        try {
            await Prof.save();
            res.status(201).json({ message: 'Professor Created' });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
});

router.post("/prof-details", async (req, res, next) => {
    const userId = req.body.id;
    const user = await Professor.findById(userId);
    if (user) {
        const body = {
            photo: user.photo,
            first: user.firstName,
            last: user.lastName,
            department: user.department,
            email: user.email,
            isAdmin: user.isAdmin,
            isCoordinator: user.isCoordinator,
            coordinatingSem:user.coordinatingSem
        }
        res.status(201).json({ message: "User Details Coming your way", userDetails: body });
    } else {
        res.status(201).json({ flag: true });
    }
})
router.post("/professor-login", async (req, res, next) => {
    const body = {
        email: req.body.email,
        password: req.body.pass
    }
    const Prof = await Professor.findOne(body);
    if (Prof) {
        res.status(201).json({ message: "Professor authenticated", User: Prof._id });
    } else {
        res.status(201).json({ flag: true });
    }
});
router.get("/get-all", async (req, res) => {
    const result = await Professor.find({})
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", prof: result });
    }
})
router.post("/update-coordinator", async (req, res, next) => {
    try {
        const result = await Professor.findById(req.body.id);
        console.log(result)
        if (!result.isCoordinator) {
            const Prof = await Professor.findOneAndUpdate(
                { _id: result._id },
                { $set: { isCoordinator: true, coordinatingSem: req.body.Year } },
                { new: true }
            )
            console.log(Prof);
            if (!Prof) {
                res.status(201).json({ flag: true });
            } else {
                res.status(201).json({ message: "Project sent", prof: Prof });
            }
        }
        else {
            res.status(201).json({ message: "Already a Co-ordinator" });
        }
    }
    catch (err){
        console.log(req)
        next(err);
    }
});

export default router;