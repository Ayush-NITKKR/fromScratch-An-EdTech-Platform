const { instance } = require("../config/razorPay");
const Course = require("../model/Course");
const User = require("../model/User");
const Payment = require("../model/Payment");
const mailSender = require("../utils/mailSender");
const { mail: courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const { paymentSuccesEmail } = require("../mail/templates/paymentSuccesEmail");


// Capture the payment

exports.capturePayment = async (req , res) => {
    try {
        // get UserID and courseID
        // validation
        // valid courseId
        // valid courseDetail
        // user already pay for the same course
        // order create 
        // reaturn response

        const { courses} = req.body;

        const userId = req.user.id;
        //validate the course id
        if(courses.length === 0){
            return res.status(404).json(
                {
                    success:false,
                    message:"No courses to purchase"
                }
            )
        }

        // Total amount 

        let totalAmount = 0;

        for( const course_id of courses){
            let course;
            try {
                course = await Course.findById(course_id);

                if(!course){
                    return res.status(404).json({
                    success:false,
                    message:"Course not found the course"
                    });
                }

                const uid = new mongoose.Types.ObjectId(userId);  // convert the conver inot the object id

                // check the user that if it already pay the same course

                if(course.studentEnrolled.includes(uid)){
                    return res.status(200).json({
                        success:false,
                        message:"This user already enrolled in the course"
                    });
                }
                totalAmount+=course.price;
                
            } catch (error) {
                    return res.status(500).json({
                        success:false,
                        message:error.message || "Something went wrong while capturing payment"
                    })
            }
        }

        //Order create
        const amount = totalAmount;
        const currency = "INR";

        const options = {
            amount: amount * 100, // mandatory data
            currency, // mandatory data
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courses,
                userId
            }
        };

        try {
            //initiate the paymont using the razorpay
            const paymentResponse = await instance.orders.create(options); // create the order
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                message:"Payment initiated successfully",
                data: paymentResponse,
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Something went wrong try again after sometime"
            })
        }
        

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "Something went wrong while capturing payment"
        })
    }
}

// //Verify the signature
// exports.verifySignature = async (req ,res) => {
//     try {
//         const webhookSecret = "12345678";

//         const signature = req.headers["x-razorpay-signature"]; // We get the req from the RazorPay API hit

//         const shasum  = crypto.createHmac("sha256" , webhookSecret);// verify the response
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");

//         if(signature === digest ){
//             console.log("Payment is authorised");

//             const {courseId , userId} = req.body.payload.payment.entity.notes; 

//             // we save the notes during the capturing the payment

//             try {
//                 // Full fill the action
                
//                 // we enroll the studnt
//                 const courseDetail = await Course.findByIdAndUpdate({_id:courseId},
//                     {
//                         $push:{ studentEnrolled:userId }
//                     },
//                     {
//                         new:true
//                     }
//                 )
//                 // validate the response also

//                 if(!courseDetail){
//                     return res.status(500).json({
//                         success:false,
//                         message:"Course not found"
//                     })
//                 }
//                 console.log(courseDetail);
                
//                 // also Update the userId 
//                 const updatedUserDetails = await User.findByIdAndUpdate({
//                     _id:userId
//                 },{
//                     $push:{
//                         courses:courseId
//                     }
//                 },
//             {
//                 new:true
//             }) 
//             console.log(updatedUserDetails);

//             // Send the mail
//             await mailSender(updatedUserDetails.email
//                 ,"Congrats You are enrolled"
//                 ,courseEnrollmentEmail(updatedUserDetails.firstName,courseDetail.courseName))

//             // return the response

//             return res.status(200).json({
//                 success:true,
//                 message:"Enrolled successfully"
//             })
//             } catch {
//                 return res.status(400).json({
//                     success:false,
//                     message:"Some thing went wrong"
//                 })
//             }
//         }

//         return res.status(400).json({
//             success:false,
//             message:"Invalid payment signature"
//         })

//     } catch {
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong"
//         })
//     }
// }

// verify payment
exports.verifyPayment = async(req , res)=>{
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userid = req.user.id;

    console.log(userid);
    

    if(!razorpay_order_id ||
        !razorpay_payment_id||
        !razorpay_signature ||
        !courses||
        !userid
    ){
        return res.status(400).json({
        success: false,
        message: "Payment failed",
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
                                .createHmac("sha256",process.env.RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest("hex");
    if(expectedSignature === razorpay_signature){
            // enroll karwao student ko

            await enrollStudent(courses , userid , res);

            const purchasedCourses = await Course.find({ _id: { $in: courses } }).select("price");
            const amount = purchasedCourses.reduce((total, course) => total + (course.price || 0), 0);
            await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id, paymentId: razorpay_payment_id },
                {
                    user: userid,
                    courses,
                    amount,
                    currency: "INR",
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    status: "Success",
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            // return res
            return res.status(200).json({ success: true, message: "Payment Verified" })
    }
    return res.status(400).json({
        success: false,
        message: "Payment failed",
        });

}

// Enroll Course directly (for mock/direct payment checkout)
const enrollStudent = async (courses, userId , res) => {
    try {

        if (!courses || !userId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }
        
        for(const courseId of courses){
            
        // Enroll student in course
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id:courseId},
            { $addToSet: { studentEnrolled: userId } },
                { new: true }
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course is"
                })
            }

            // Add course to user's courses list
            const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId } },
            { new: true }
            );
             // Send confirmation email
                try {
                    await mailSender(
                        updatedUser.email,
                        "Congrats, You are enrolled!",
                        courseEnrollmentEmail(updatedUser.firstName, enrolledCourse.courseName)
                    );
                } catch (emailError) {
                    console.error("Failed to send enrollment email:", emailError);
                }
        }

    } catch (error) {
        console.error("Direct enrollment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to enroll user in course"
        });
    }
}

exports.sendPaymentSuccessEmail = async(req ,res)=>{
    const {orderId , paymentId , amount} = req.body;

    const userId = req.user.id;
    const email = req.user.email;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success:false,
            message:"please provide all the feilds"
        })
    }
    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            email,
            `Payment recieved`,
            paymentSuccesEmail(`${enrolledStudent.firstName}`,amount/100 , orderId , paymentId)
        )
        return res.status(200).json({
            success:true,
            message:"Payment success email sent"
        })
    } catch (error) {
        console.log("error in sending mail", error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }
}

exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const payments = await Payment.find({ user: userId })
            .populate({
                path: "courses",
                select: "courseName thumbnail price",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Could not fetch payment history",
        });
    }
}
