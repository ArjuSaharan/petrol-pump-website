

// export const testSMS = async (req, res) => {

//     try {
//         const { phone, message } = req.body;

//         if (!phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone number is required"
//             });
//         }

//         if (!message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Message is required"
//             });
//         }

//         const result = await sendSMS(phone, message);

//         return res.status(200).json({
//             success: true,
//             message: "SMS sent successfully",
//             result
//         });

//     } catch (error) {

//         console.error("TEST SMS ERROR:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// export const testWhatsApp = async (req, res) => {

//     try {

//         const { phone, message } = req.body;

//         if (!phone || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone and message are required"
//             });
//         }

//         const result = await sendWhatsApp(
//             phone,
//             message
//         );

//         return res.json({
//             success: result.success,
//             result
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };


// // ===============================
// // TEST BOTH
// // ===============================
// export const testNotification = async (req, res) => {

//     try {

//         const { phone, message } = req.body;

//         if (!phone || !message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone and message are required"
//             });
//         }

//         const result = await sendNotification(
//             phone,
//             message
//         );

//         return res.json({
//             success: true,
//             result
//         });

//     } catch (error) {

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };