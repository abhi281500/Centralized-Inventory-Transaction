import Business from "../models/Business.models.js"
import User from "../models/User.models.js"

export const createBusiness = async (req, res) => {
    try {
        const { businessName, businessType, GSTIN, currency, timezone, address } = req.body;

        if (!businessName || !businessType || !GSTIN || !currency || !timezone || !address) {
            return res.status(400).json({ message: "Please fill all required fields" })
        }
        const owner = req.user._id;
        if (!owner) {
            return res.status(401).json({
                message: "User is not authenticated",
            });
        }

        const existingBusiness = await Business.findOne({
            owner,
        });

        if (existingBusiness) {
            return res.status(409).json({
                message: "Business already exists for this owner"
            });
        }
        const newBusiness = await Business.create(
            {
                businessName,
                businessType,
                GSTIN,
                currency,
                timezone,
                address,
                owner
            }
        )

    await User.findByIdAndUpdate(owner, {
      businessId: newBusiness._id,
      role: "OWNER",
    });
       
    

        return res.status(201).json({
            message: "Busineess Created Successfully ",
           business :newBusiness
        })

    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



 export const  getBusiness =async(req,res) => {
    try {
         const business = await Business.findOne({
        owner : req.user._id
    })
 if(!business) {
      return res.status(404).json({
        message: "Business not found for this owner",
      });
    } 
    return res.status(200)
    .json({
        message :"Business retrieve successfully",
        business
    })
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message :"Internal Server Error"
           
        })
    }
   
 }



 export const updateBusiness = async(req,res) =>{
    try {
        const {id} =req.params
        const { businessName, businessType, GSTIN, currency, timezone, address } = req.body;

        const business = await Business.findOne({
           owner: req.user._id
        })

         if(!business) {
      return res.status(404).json({
        message: "Business not found for this owner",
      });
    } 

    business.businessName =businessName ?? business.businessName
    business.businessType =businessType ?? business.businessType
    business.GSTIN =GSTIN ?? business.GSTIN
    business.currency = currency ?? business.currency
    business.timezone = timezone ?? business.timezone
    business. address =address ?? business.address

    await business.save()
    return res.status(200)
    .json({
        message : "Business Updated Successfully"
    })


        
    } catch (error) {
        console.error(error);
        return res.status(500)
        .json({
            message :"Internal Server Error"
        })
        
        
    }
 }

export const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findOne({
            owner: req.user._id
        });

        if (!business) {
            return res.status(404).json({
                message: "Business not found for this owner",
            });
        }

        
        await business.deleteOne();

        // Remove business connection from user
        await User.findByIdAndUpdate(req.user._id, {
            businessId: null,
            role: null,
        });

        return res.status(200).json({
            message: "Business Deleted Successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


export const getBusinessSettings = async (req, res) => {
    try {
        const business = await Business.findOne({
            owner: req.user._id
        });

        if (!business) {
            return res.status(404).json({
                message: "Business not found for this owner",
            });
        }

        const businessSettings = {
            businessName: business.businessName,
            businessType: business.businessType,
            GSTIN: business.GSTIN,
            currency: business.currency,
            timezone: business.timezone,
            address: business.address,
        };

        return res.status(200).json({
            message: "Business Settings Retrieved Successfully",
            businessSettings
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};




export const updateBusinessSettings = async(req,res) =>{
    try {
        const {id} = req.params
        const { businessName, businessType, GSTIN, currency, timezone, address } = req.body;
         const business  = await Business.findOne({
            owner :req.user._id
        })

        if(!business) {
      return res.status(404).json({
        message: "Business not found for this owner",
      });
    } 
    business.businessName =businessName ?? business.businessName
    business.businessType =businessType ?? business.businessType
    business.GSTIN =GSTIN ?? business.GSTIN
    business.currency = currency ?? business.currency
    business.timezone = timezone ?? business.timezone
    business. address =address ?? business.address

    await business.save()
    return res.status(200)
    .json({
        message : "Business Updated Successfully"
    })


    } 
    catch (error) {
        console.error(error);
        return res.status(500)
        .json({
            message :"Internal Server Error"
        }) 
    }
}