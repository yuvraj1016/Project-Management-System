import Project from "../mongodb/Schema/postSchema.js";
import User from "../mongodb/Schema/userSchema.js";
import { Types } from "mongoose";
import express from "express";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: "projectFile" },
    { name: "projectImage" }
]);

router.post("/post-entry", upload, async (req, res) => {
    const userId = await User.findById(req.body.id);
    const body = {
        user: new Types.ObjectId(userId._id),
        projectName: req.body.Name,
        firstName: userId.firstName,
        lastName: userId.lastName,
        rollNumber: userId.rollNumber,
        year: userId.year,
        semester: userId.semester,
        projectImage: {
            data: req.files.projectImage[0].buffer,
            contentType: req.files.projectImage[0].mimetype
        },
        projectDescription: req.body.desc,
        supervisorName: userId.supervisor,
        supervisorEmail: userId.supervisorEmail,
        projectFile: {
            data: req.files.projectFile[0].buffer,
            contentType: req.files.projectFile[0].mimetype
        },
        domain: req.body.domain,
        status:req.body.status,
    }
    const project = await Project.find({ projectName: req.body.Name });
    if (project.length > 0) {
        res.status(201).json({ flag: true });
    } else {
        const proj = new Project(body);
        await proj.save();
        res.status(201).json({ message: "Project Submitted" });
    }
})
router.get("/get-post", async (req, res) => {
    const Post = await Project.find({});
    if (!Post) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: Post });
    }
})
router.get("/update-views", async (req, res) => {
    const id = req.query.userid;
    const view = req.query.viewed;
    const Post = await Project.findOneAndUpdate(
        { _id: id },
        { $set: { viewed: view } },
        { new: true }
    );
    if (!Post) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: Post });
    }
});
router.post("/getprof-post", async (req, res) => {
    const email = req.body.email;
    const result = await Project.find({ supervisorEmail: email });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
});
router.post("/user-post", async (req, res) => {
    const userId = await User.findById(req.body.id);
    const result = await Project.find({ rollNumber: userId.rollNumber, semester: userId.semester, year: userId.year });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
});
router.post("/search-roll", async (req, res) => {
    const result = await Project.find({ rollNumber: req.body.rollno });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
})
router.post("/search-semester", async (req, res) => {
    const result = await Project.find({ semester: req.body.sem });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
})
router.post("/search-supervisor", async (req, res) => {
    const result = await Project.find({ supervisorName: req.body.supname });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
})
router.post("/search-year", async (req, res) => {
    const result = await Project.find({ year: req.body.Year });
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
})

router.get("/update-grade", async (req, res) => {
    const id = req.query.userid;
    const Grade = req.query.Grade;
    const Post = await Project.findOneAndUpdate(
        { _id: id },
        { $set: { grade: Grade } },
        { new: true }
    );
    if (!Post) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent" });
    }
});
router.get("/test", async (req, res) => {
    const result = await Project.find({}).populate("user");
    console.log(result); 
    if (!result) {
        res.status(201).json({ flag: true });
    } else {
        res.status(201).json({ message: "Project sent", project: result });
    }
})
export default router;

