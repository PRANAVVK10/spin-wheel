const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { userService, spinService } = require('../services');
const {google} = require('googleapis');


const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');


const serviceAccount = require('../config/firebase.json');

const tmi = require('tmi.js');
const request = require('request');

	

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();




const youtube = google.youtube('v3');

const Oauth2 = google.auth.OAuth2;

const ClientID = '1022249698599-cvtmrmnk6gg8mj5er5lsmjnfd7poh3j1.apps.googleusercontent.com'
const ClientSecret = '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'
const redirectUri = `${config.server.host}/v1/auth/google/callback`



const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
]




const auth = new Oauth2(ClientID, ClientSecret, redirectUri)



let liveChatId;
let nextPage;

let chatMessages = [];
let messageId = []


// const findActiveChat = catchAsync(async (req, res) =>{

//     // console.log({user:req.headers.user});
//    const googleAccessToken = await userService.getGoogleToken(req.params.id)

// //    console.log(googleAccessToken);

//          const tokens = {"access_token":googleAccessToken,
//         "refresh_token":googleAccessToken,
//         "scope":scopes,"token_type":"Bearer","expiry_date":2443981883381}


//         auth.setCredentials(tokens)

//     const response = await youtube.liveBroadcasts.list({
//         auth:auth,
//         part:'snippet',
//         broadcastStatus:'active',
//     })


//     console.log(response);

//     const latestChat = response.data.items[0];
//     liveChatId = latestChat.snippet.liveChatId;
//     // console.log('chatId', latestChat.snippet);
//     // res.send(liveChatId)

//     //

//     const secondresponse = await youtube.liveChatMessages.list({
//         auth:auth,
//         part:'authorDetails',
//         liveChatId:liveChatId,
//         pageToken:nextPage,
//     })
//     const { data } = secondresponse;
//     const newMessage = data.items;
//     chatMessages.push({...newMessage});
//     nextPage = data.nextPageToken;
//     // console.log('total chat messages : ' , newMessage);
//     newMessage.map(msg=>{
//         let id = msg.authorDetails.channelId
//         let name = msg.authorDetails.displayName
//         let image = msg.authorDetails.profileImageUrl
//         messageId.push({id , name , image })
       
//     })
//     res.send(messageId)
//     // console.log(secondresponse);
   
// })


//const twitchLogin = catchAsync(async (req,res)=>{
    // const url = `https://id.twitch.tv/oauth2/authorize
    // ?client_id=91iddwyoev45f6dba8235ihdzzlzgy
    // &redirect_uri=http://localhost:3310/spin/spinData
    // &response_type=token
    // &scope=channel:moderate+chat:edit+chat:read`

    // request(url,(err,res,body)=>{
    //     console.log(res);
    // })

    // res.send(res.header)

//})




const findActiveChat = catchAsync(async (req,res)=>{
})
// const findActiveChat = catchAsync(async (req,res)=>{
    // const client = new tmi.Client({
    //     channels: [ 'pranavvk10' ]
    // });
    
    // client.connect();
    
    // client.on('message', (channel, tags, message, self) => {
    //     // "Alca: Hello, World!"
    //     console.log(`${tags['display-name']}: ${message}`);
    //     res.send(`${tags['display-name']}: ${message}`)
    // });

    // const client = new tmi.Client({
    //     options: { debug: true },
    //     identity: {
    //         username: 'pranavvk10',
    //         password: 'oauth:3bxq7whqtv8oiemdqdnpeavsk2cqfz'
    //     },
    //     channels: [ 'pranavvk10' ]
    // });
    
    // client.connect();
    
    // client.on('message', (channel, tags, message, self) => {
    //     // Ignore echoed messages.
    //     if(self) return;
    //     console.log(`${tags['display-name']}: ${message}`);


    //     let id = tags.id;
    //     let name = tags['display-name'];

    //     chatDetails.push({id, name})

    //     // res.send(chatDetails)
    //     // console.log(chatDetails);



    // });
    
// })



const clearChat = catchAsync(async (req, res) =>{

    // console.log("winner");
    // console.log(req.query.winner);
    // let winner = req.query.winner;

    // messageId = [];
    // res.status(400).redirect('http://localhost:3310/spin');
    // await spinService.createSpin({spinId:'123',userId:'111',userName:userName ? winner : null})
})


const createSpin =  catchAsync(async (req, res) => {


    const { user } = req

    const spin = await spinService.createSpin(user)

//    if(spin.created){
//          const docRef = db.collection('bridge').doc(spin.id);


//     // const fb_res = await docRef.set({
//     // spin:false
//     // });
//    }

   console.log({spin})
    res.send(spin)
})

const startSpin = catchAsync(async (req, res) =>{
   if(!req.body.id || !req.user){
    throw new ApiError(httpStatus.NOT_FOUND, 'invalid request');
   }
    const {user , body}  = req
    console.log({user,b:body.id}); 
    const theSpin = await spinService.getSpin({id: body.id, user:user._id})

    console.log({theSpin})
    if(!theSpin){

        throw new ApiError(httpStatus.NOT_FOUND, 'invalid request');

    }
    //     const docRef = db.collection('bridge').doc(theSpin.id);
    //     const spinFalse = await docRef.set({
    //         spin:false
    //        });
    //    setTimeout(async () => {
    //     const spinTrue = await docRef.set({
    //         spin:true
    //     });
    //    }, 200);
    

    res.status(httpStatus.OK).send({user:user.id})

})



const getSpinById = catchAsync(async (req, res) =>{
    console.log({r:req.params.id})
    const spin = await spinService.getSpinById(req.params.id)
    res.status(httpStatus.OK).send(spin)


})






module.exports = {
    clearChat,
    createSpin,
    startSpin,
    getSpinById,
    findActiveChat
//   createUser,
//   getUsers,
//   getUser,
//   updateUser,
//   deleteUser,
};
