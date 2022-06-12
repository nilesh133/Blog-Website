const express = require("express");
const router = express.Router();
const auth = require("../utils/auth");
const { updateName,
    updatePassword,
    updatePasswordValidations,
    updateAbout,
    updateAboutValidation,
    updateEmail,
    updateUsername,
    updateProfession,
    updatePhone,
    updateAge,
} = require('../controllers/profileController');

router.post('/updatename', auth, updateName);
router.post('/updatepassword', [auth, updatePasswordValidations], updatePassword);
router.get('/about', auth);
router.post('/updateabout', updateAboutValidation, updateAbout);
router.post('/updateemail', auth, updateEmail);
router.post('/updateusername', auth, updateUsername);
router.post('/updateprofession', auth, updateProfession);
router.post('/updatephone', auth, updatePhone);
router.post('/updateage', auth, updateAge);
module.exports = router;