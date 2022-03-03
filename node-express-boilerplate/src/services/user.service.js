const httpStatus = require('http-status');
const { use } = require('passport');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

const createGoogleUser = async (userBody) => {
  console.log({userBody})
  if (await User.isEmailTaken(userBody.google.googleProfile.emails[0].value)) {
    const user = await getUserByEmail(userBody.google.googleProfile.emails[0].value);
    if(user.google && (user.google.googleProfile.emails[0].email === userBody.google.googleProfile.emails[0].value) 
    && user.google.googleAccessToken == userBody.google.googleAccessToken){
      return user;
    }
    return User.findByIdAndUpdate(user.id, {google:userBody.google, name:userBody.google.googleProfile.displayName});
  }
  return User.create({...userBody, email:userBody.google.googleProfile.emails[0].value, name:userBody.google.googleProfile.displayName});
};

const createTwitchUser = async (userBody)=>{

  if(await User.isEmailTaken(userBody.twitch.profile.email)){
    const user = await getUserByEmail(userBody.twitch.profile.email)
    if(user.twitch && ( user.twitch.profile.email === userBody.twitch.profile.email)&&
    user.twitch.twitchAccessToken == userBody.twitch.twitchAccessToken){
      return user
    }
    return User.findByIdAndUpdate(user.id, {twitch:userBody.twitch, name:userBody.twitch.profile.display_name});
  }
  return User.create({...userBody, email:userBody.twitch.profile.email, name:userBody.twitch.profile.display_name});
}


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};



const getGoogleToken = async (id) =>{
  const user = await User.findById(id)
    return user.google.googleAccessToken
  }


module.exports = {
  createUser,
  createGoogleUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getGoogleToken,
  createTwitchUser
};
