import express from "express"
import {createUser ,getAllUsers,getUser,updateUser,deleteUser,changeUserStatus} from "../controllers/user.controller.js"
import auth from "../middlewares/auth.middlewares.js"
const router = express.Router()

router.post(
    '/',
    auth,
    createUser
)

router.get(
    "/",
    auth,
    getAllUsers
)

router.get(
    "/:id",
    auth,
    getUser
)

router.put(
    "/:id",
    auth,
    updateUser
) 

router.delete(
    "/:id",
    auth,
    deleteUser
)
router.patch(
    "/:id/status",
    auth,
    changeUserStatus
)


export default router