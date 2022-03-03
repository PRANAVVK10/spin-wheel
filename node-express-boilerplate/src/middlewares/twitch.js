// const axios = require('axios');
const axios = require('axios');

const getTwitchProfile = async (req, res, next) => {
  const { user } = req;
  const { profile } = user;
  const { login, id, accessToken} = profile
  // console.log({ user });

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

    req.body.twitch = {
      twitchAccessToken : accessToken,
      profile : data
      // twitchProfile: data.
    };
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
