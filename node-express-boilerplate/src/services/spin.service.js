const httpStatus = require('http-status');
const { User, Spin } = require('../models');
const ApiError = require('../utils/ApiError');






// create spin route




const createSpin = async (userId) => {

  const spin = await Spin.spinExists(userId)

  if (spin) {
    // throw new ApiError(httpStatus.BAD_REQUEST, 'spin already created');
    return {
      spin,
      created:false,
    }
  }

  const user = await User.findById(userId)
  const spinData = await Spin.create({user : userId, username: user.twitch.profile.login})
  // const spinData = await Spin.findOne({  user : userId }).populate('user');
return{

  spin:spinData,
  created:true
} 



  // if(spinData){
  //   console.log(spinData);
  //  const update = await Spin.create(spinData);
  //  console.log(update);
  // }

}


const getSpin = (userBody) =>{
  return Spin.findOne({_id:userBody.id, user: userBody.user})  
} 

const getSpinById = (id) =>{
  return Spin.findById(id)  
} 




/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
// const createUser = async (userBody) => {
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   return User.create(userBody);
// };

// const createGoogleUser = async (userBody) => {
//   console.log({userBody})
//   if (await User.isEmailTaken(userBody.google.googleProfile.emails[0].value)) {
//     const user = await getUserByEmail(userBody.google.googleProfile.emails[0].value);
//     if(user.googleData && (user.google.googleProfile.emails[0].email === userBody.google.googleProfile.emails[0].value) 
//     && user.google.googleAccessToken == userBody.google.googleAccessToken){
//       return user;
//     }
//     return User.findByIdAndUpdate(user.id, {google:userBody.google});
//   }
//   return User.create({...userBody, email:userBody.google.googleProfile.emails[0].value, name:userBody.google.googleProfile.displayName});
// };

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
// const getUserById = async (id) => {
//   return User.findById(id);
// };

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };

module.exports = {
  // createUser,
  // createGoogleUser,
  // queryUsers,
  // getUserById,
  // getUserByEmail,
  // updateUserById,
  // deleteUserById,
    createSpin,
    getSpin,
    getSpinById,
};
