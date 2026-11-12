const express =require("express");
const verifyToken=require("../middlewares/authMiddleware");
const authorizeRoles=require("../middlewares/roleMiddleware");
const router=express.Router();
const MigrantProfile = require("../models/migrantProfile");






//only admin can access this route
router.get("/admin",verifyToken,authorizeRoles("admin"),(req,res)=>
{
    res.json({message:"welcome admin"});
});

 
//both admin and manager can access this route
router.get("/doctor",verifyToken,authorizeRoles("doctor","admin"),(req,res)=>
{
    res.json({message: "welcome doctor"});
});

//both admin and manager can access this route
router.get("/government",verifyToken,authorizeRoles("government","admin"),(req,res)=>
{
    res.json({message: "welcome government"});
});

//all can access this route
router.get("/migrant",verifyToken,authorizeRoles("admin","migrant"),(req,res)=>
{
    res.json({message:"welcome user"});
});

router.get(
  "/patient/:id",
  verifyToken,
  authorizeRoles("doctor", "admin"),
  async (req, res) => {
    try {

      const migrant = await MigrantProfile.findOne({
        userId: req.params.id
      });

      if (!migrant) {
        return res.status(404).json({ message: "Patient not found ❌" });
      }

      res.json(migrant);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
module.exports=router;