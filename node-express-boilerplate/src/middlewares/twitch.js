// const axios = require('axios');
const axios = require('axios');

const getTwitchProfile = async (req, res, next) => {
  const { user } = req;
  const { twitch } = user;
  const { profile, accessToken} = twitch
  const { id, login} = profile
  console.log({ user });

  try {
    const url = `https://api.twitch.tv/helix/users?login=${login}&id=${id}`
    const newURL = encodeURIComponent(url)
    // console.log({url})
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": "91iddwyoev45f6dba8235ihdzzlzgy",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.data.data[0]
    

    // const {data} = await response;

    // var json = JSON.parse(data);

    // console.log({ data });

    // console.log({ json });

    console.log({twitch:req.user.twitch})
    req.user.twitch.profile = data

    // req.twitchNewProfile = data;
// res.send({data})
    return next();
  } catch (err) {
    console.log({ err });
    res.send({ err });
  }
};


module.exports = { getTwitchProfile };

// profile.id = json.id;
// profile.username = json.login;
// profile.displayName = json.display_name;
// profile.email = json.email;

// profile._raw = body;
// profile._json = json;
//next();
