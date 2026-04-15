import twilio from "twilio";

// getting the credential from the client 
const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export default async function sendSMS(phone, otp) {
    try{
        //cross cehck validt phone number
        if(!phone.startsWith("+")){
            throw new Error("Phone number must be in (e.g. +91xxxxxxxxxx) ")
        }
        await client.messages.create({
            body: `Your FINM verification OTP is: ${otp}. Valid for 5 minutes. Do not share this.`,
    from: process.env.TWILIO_PHONE,
    to: phone, // must be in E.164 format e.g. +919876543210
        });
        console.log("OTP send succesfully");
    }
    catch(error){
        console.error("Error in sending sms",error.message);
        throw error;
    }
    
}