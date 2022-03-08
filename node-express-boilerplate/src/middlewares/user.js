const httpStatus = require("http-status");
const { userService } = require("../services");
const ApiError = require("../utils/ApiError");


const getUserAccessToken = async(req,res,next)=>{

    console.log({user:req.params.user})
    if (!req.params.user || !req.params.id || !req.params.username) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const user = await userService.getUserById(req.params.user)


    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User Details not found');
    }
    const profile = { login :  req.params.username }
    profile.id = req.params.id



    const twitch = {profile:profile, accessToken:user.twitch.accessToken}
    req.user = {twitch:twitch}

    // req.user = { profile:profile}
    // req.user.profile = profile

    return next()



}





module.exports = { getUserAccessToken };