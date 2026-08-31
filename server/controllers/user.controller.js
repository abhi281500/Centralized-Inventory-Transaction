import Business from "../models/Business.models.js";
import User from "../models/User.models.js";
export const  createUser= async(req,res)=>{
    try {
        const owner = req.user._id
         if (!owner) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        }
        const { name, email, password, phone,role } = req.body;

        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ message: "Please fill all required fields" })
        }

        const business=await Business.findOne({
            owner
        }) 

        if(!business){
            return res.status(404).json({
                message :"Not Business Found"
            })
        }


        const existingemail =await User.findOne({
            email: email.trim().toLowerCase(),
        })

        if(existingemail){
             return res.status(409).json({
                message: "This Person already exists for this owner"
            });
        }

            const newUser = await User.create({
            name,
            email: email.trim().toLowerCase(),
            password,
            phone,
            role,
            businessId : business._id
            })
            
            

       return res.status(201).json({
         message: "User created successfully", 
         user: { 
            id: newUser._id,
            name: newUser.name, 
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role, 
            businessId: newUser.businessId,
             },
             });   
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message :"Internal server error"
        })
        
    }
}


export const  getAllUsers =async(req,res)=>{
    try {
        const owner = req.user._id
         if (!owner) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        } 

        const business=await Business.findOne({
            owner
        }) 

        if(!business){
            return res.status(404).json({
                message :"Not Business Found"
            })
        }
        const users = await  User.find({
            businessId: business._id   
        })
        

        return res.status(200)
        .json({
        message :"All User retrieve successfully",
        users
    })
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message :"Internal server error" 
            })
    }
}



export const  getUser =async(req,res)=>{
    try {
        const owner = req.user._id
         if (!owner) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        } 

        const business=await Business.findOne({
            owner
        }) 

        if(!business){
            return res.status(404).json({
                message :"No Business Found"
            })
        }
        
        const user = await  User.findOne({
             _id: req.params.id,
            businessId :business._id,     
        })

        
        return res.status(200)
        .json({
        message :"User retrieve successfully",
        user
    })
    } 
    catch (error) {
           console.error(error);
        return res.status(500).json({
            message :"Internal server error" 
            })
    }
}



export const  updateUser =async(req,res)=>{
    try {
        const owner =req.user._id
        if(!owner){
             return res.status(401).json({
                message: "User is not authenticated",
        })
    }
        const business = await Business.findOne({
            owner
        })
        if(!business){
            return res.status(404).json({
                message :"Not Business Found"
            })
        }

        const {id} =req.params

        const { name, email, password, phone,role } = req.body;

        const user = await  User.findOne({
            _id :id,
            businessId: business._id   
        })

        if(!user){
           return res.status(404).json({
                message :"No User Found"
            }) 
        }

        user.name =name ?? user.name 
        user.email = email ? email.trim().toLowerCase(): user.email;
        user.password =password ??user.password
        user.phone=phone ?? user.phone
        user.role = role ?? user.role
        
        await user.save()

        return res.status(200).json({
            message :"Update User Successfuly"
        })

    } 
    catch (error) {
           console.error(error);
        return res.status(500).json({
            message :"Internal server error" 
            })
    }
}




 export const  deleteUser=async(req,res) =>{
    try {
        const owner = req.user._id

        const business = await Business.findOne({
            owner
        })
       if(!business){
            return res.status(404).json({
                message :"No Business Found"
            })
        }

        const {id} =req.params
        const user = await  User.findOne({
            _id :id,
            businessId :business._id  
        })

        if(!user){
           return res.status(404).json({
                message :"No User Found"
            }) 
        }
        await user.deleteOne()


        return res.status(200)
        .json({
            message : "User Deleted Successfully"
        })

        
    } catch (error) {
           console.error(error);
        return res.status(500).json({
            message :"Internal server error" 
            })
    }
}



export const changeUserStatus = async (req, res) => {
    try {
        
        const owner = req.user._id;

        if (!owner) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        }

       
        const business = await Business.findOne({
            owner
        });

        if (!business) {
            return res.status(404).json({
                message: "No Business Found"
            });
        }

       
        const { id } = req.params;

        
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be true or false"
            });
        }

        
        const user = await User.findOne({
            _id: id,
            businessId: business._id
        });

        if (!user) {
            return res.status(404).json({
                message: "No User Found"
            });
        }

        
        user.isActive = isActive;

        await user.save();

        return res.status(200).json({
            message: isActive
                ? "User activated successfully"
                : "User deactivated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};




 