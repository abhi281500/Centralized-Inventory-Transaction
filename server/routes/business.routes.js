import auth from "../middlewares/auth.middlewares.js"
import express, { Router } from "express"
import {createBusiness , 
    getBusiness,
    updateBusiness,
    deleteBusiness,
    getBusinessSettings,
    updateBusinessSettings} from "../controllers/business.controllers.js"

const router = express.Router()

router.post(
    "/",
    auth,
    createBusiness
)

router.get(
    "/",
    auth,
    getBusiness
)

router.get(
     "/settings",
    auth,
    getBusinessSettings
)



router.put(
    "/:id",
    auth,
    updateBusiness
) 
router.put(
    "/:id/settings",
    auth,
    updateBusinessSettings
)

router.delete(
    "/",
    auth,
    deleteBusiness
)


export default router;