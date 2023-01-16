const express = require('express')
const router = express.Router()
const { doctors } = require('../models')
const bcrypt = require('bcrypt')
const {validateToken} = require('../middlewares/AuthMiddleware')

const {sign, decode } = require('jsonwebtoken')

//Doctor
router.get("/", async(req, res)=>{
    const listOfDoctors = await doctors.findAll()
    res.json(listOfDoctors)
})
router.get('/byId/:docId',async (req, res)=>{
  const docId = req.params.docId
  const specificDoctor = await doctors.findByPk(docId);
  res.json(specificDoctor)
})
router.post("/",async (req, res) => {
    const {doctorName, doctorSpecialization, doctorExperience, doctorEmail, doctorPassword} = req.body
    bcrypt.hash(doctorPassword,10).then((hash)=>{
      doctors.create({
        doctorName: doctorName,
        doctorSpecialization: doctorSpecialization,
        doctorExperience: doctorExperience,
        doctorEmail: doctorEmail,
        doctorPassword: hash
      })
      res.json("Successfully Registered")
    })
  });

router.post('/login', async(req, res)=>{
  
  const { doctorEmail, doctorPassword} = req.body;
  const doctor = await doctors.findOne({where:{doctorEmail: doctorEmail}})
  // console.log(doctor)
  if(!doctor){
    res.json({error:"User Doesn't exist"});
  }else{
    bcrypt.compare(doctorPassword,doctor.doctorPassword).then(async(match)=>{
      if (!match){
        res.json({error: "Wrong Username and Password Combination"});
      } else{
        const userDetails = { doctorId: doctor.doctorId ,doctorName: doctor.doctorName, doctorSpecialization: doctor.doctorSpecialization, doctorEmail: doctor.doctorEmail}
        const accessToken = sign({doctorEmail: doctor.doctorEmail, docId: doctor.docId},
        "importantSecret");
        res.json({accessToken, userDetails})
      }
    })
  }
})









module.exports = router