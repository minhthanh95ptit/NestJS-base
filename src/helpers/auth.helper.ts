// exports.updatePasscodeToUserDB = async (passcode, email, organizationId) => {
//     const result = await db.User.update(
//       {
//         loginVerifyCode: passcode,
//         loginVerifyCodeCreatedTime: moment().format(),
//       },
//       {
//         where: {
//           email,
//         },
//       },
//       {
//         new: true,
//       },
//     );
  
//     return result;
//   };