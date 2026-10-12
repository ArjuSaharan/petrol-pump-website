import twilio from 'twilio';


const client=twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)


const formatPhoneNumber = (phone) => {

    if (!phone) {
        throw new Error("Customer phone number is required");
    }

    let number = phone.toString().replace(/\s+/g, "");

    // 9876543210
    if (/^[6-9]\d{9}$/.test(number)) {
        return `+91${number}`;
    }

    // 919876543210
    if (/^91\d{10}$/.test(number)) {
        return `+${number}`;
    }

    // +919876543210
    if (/^\+91\d{10}$/.test(number)) {
    return number;
}

    return number;
};

// send sms

export const sendSMS =async(phone,message)=>{
    try{
         console.log("--------------------------------");
        console.log("SEND SMS FUNCTION");
        console.log("PHONE:", phone);
        console.log("MESSAGE:", message);

        const formattedPhone=formatPhoneNumber(phone);

         console.log("FORMATTED PHONE:", formattedPhone);
        console.log(
            "FROM PHONE:",
            process.env.TWILIO_PHONE_NUMBER
        );


        const result=await client.messages.create({
            body:message,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:formattedPhone
        })
        
        console.log("sms sent successfully");
        console.log("message if:", result.sid);

        return {
            success:true,
            sid:result.sid,
        }
    }
    catch(error){
        console.log("sms error:" ,error.message);
        return {
            success:false,
            message:error.message
        }
    }
}

// whatapp send;

export const sendWhatsApp=async(phone,message)=>{
    try{
        const formattedPhone = formatPhoneNumber(phone);
        const result=await client.messages.create({
            body:message,
            from:`whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to:`whatsapp:${formattedPhone}`
        })

        console.log("whatsapp send successfully");
        console.log("message" ,result.sid);

        return {
            succsess:true,
            sid:result.sid
        }
    }
    catch (error) {

        console.error("WhatsApp Error:", error.message);

        return {
            success: false,
            message: error.message
        };
    }
}


// send both
export const sendNotification = async (phone, message) => {

    const smsResult = await sendSMS(
        phone,
        message
    );

    const whatsappResult = await sendWhatsApp(
        phone,
        message
    );

    return {
        sms: smsResult,
        whatsapp: whatsappResult
    };
};
