require("dotenv").config();
var Upstox = require("upstox")
const express = require("express")
const app = express()
const bodyparser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const axios = require('axios')
const talib = require('ta-lib');
var UpstoxClient = require("upstox-js-sdk");
const WebSocket = require("ws").WebSocket;
const protobuf = require("protobufjs");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const apiKey = '88d7c250-6694-40a6-991a-5f8c219a7f70'
// const apiSecret = 'x9q30ml8qx'

const apiKey = '88d7c250-6694-40a6-991a-5f8c219a7f70';
const redirectUri = 'http://localhost:2222/';


// Construct the API URL
const apiUrl = `https://api-v2.upstox.com/login/authorization/dialog?response_type=code&client_id=${apiKey}&redirect_uri=${redirectUri}`;



// Make the GET request to the Upstox login API

app.get("/", (req, res) => {
    const code = req.query.code;
    console.log(code);

    const upstoxTokenURL = 'https://api-v2.upstox.com/login/authorization/token';
    const clientID = '88d7c250-6694-40a6-991a-5f8c219a7f70';
    const clientSecret = 'x9q30ml8qx';
    const redirectURI = 'http://localhost:2222/';
    const authCode = code;
    const data = new URLSearchParams();
    data.append('code', authCode);
    data.append('client_id', clientID);
    data.append('client_secret', clientSecret);
    data.append('redirect_uri', redirectURI);
    data.append('grant_type', 'authorization_code');
    let access;
    axios.post(upstoxTokenURL, data, {
            headers: {
                'Api-Version': '2.0',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => {
            const accessToken = response.data.access_token;
            access = accessToken;
            console.log('Access Token:', access);
            // Now you have the access token for authenticated requests
        }).then(() => {
            const url = 'https://api-v2.upstox.com/market-quote/quotes?symbol=NSE_EQ|INE848E01016';
            console.log(access);
            const headers = {
                'accept': 'application/json',
                'Api-Version': '2.0',
                'Authorization': `Bearer ${access}`,
            };

            console.log(headers);

            // trying for real time data using upstox api

            let protobufRoot = null;
            let defaultClient = UpstoxClient.ApiClient.instance;
            let apiVersion = "2.0";
            let OAUTH2 = defaultClient.authentications["OAUTH2"];
            OAUTH2.accessToken = access;
            const getMarketFeedUrl = async() => {
                return new Promise((resolve, reject) => {
                    let apiInstance = new UpstoxClient.WebsocketApi(); // Create new Websocket API instance

                    // Call the getMarketDataFeedAuthorize function from the API
                    apiInstance.getMarketDataFeedAuthorize(
                        apiVersion,
                        (error, data, response) => {
                            if (error) reject(error); // If there's an error, reject the promise
                            else resolve(data.data.authorizedRedirectUri); // Else, resolve the promise with the authorized URL
                        }
                    );
                });
            };

            // Function to establish WebSocket connection
            const connectWebSocket = async(wsUrl) => {
                return new Promise((resolve, reject) => {
                    const ws = new WebSocket(wsUrl, {
                        headers: {
                            "Api-Version": apiVersion,
                            Authorization: "Bearer " + OAUTH2.accessToken,
                        },
                        followRedirects: true,
                    });

                    // WebSocket event handlers
                    ws.on("open", () => {
                        console.log("connected");
                        resolve(ws); // Resolve the promise once connected

                        // Set a timeout to send a subscription message after 1 second
                        setTimeout(() => {
                            const data = {
                                guid: "someguid",
                                method: "sub",
                                data: {
                                    mode: "full",
                                    instrumentKeys: ["NSE_INDEX|Nifty Bank", "NSE_INDEX|Nifty 50"],
                                },
                            };
                            ws.send(Buffer.from(JSON.stringify(data)));
                        }, 1000);
                    });

                    ws.on("close", () => {
                        console.log("disconnected");
                    });

                    ws.on("message", (data) => {
                        console.log(JSON.stringify(decodeProfobuf(data))); // Decode the protobuf message on receiving it
                    });

                    ws.on("error", (error) => {
                        console.log("error:", error);
                        reject(error); // Reject the promise on error
                    });
                });
            };

            // Function to initialize the protobuf part
            const initProtobuf = async() => {
                protobufRoot = await protobuf.load(__dirname + "/MarketDataFeed.proto");
                console.log("Protobuf part initialization complete");
            };

            // Function to decode protobuf message
            const decodeProfobuf = (buffer) => {
                if (!protobufRoot) {
                    console.warn("Protobuf part not initialized yet!");
                    return null;
                }

                const FeedResponse = protobufRoot.lookupType(
                    "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
                );
                return FeedResponse.decode(buffer);
            };

            // Initialize the protobuf part and establish the WebSocket connection
            (async() => {
                try {
                    await initProtobuf(); // Initialize protobuf
                    const wsUrl = await getMarketFeedUrl(); // Get the market feed URL
                    const ws = await connectWebSocket(wsUrl); // Connect to the WebSocket
                } catch (error) {
                    console.error("An error occurred:", error);
                }
            })();



            // trial ends here

            axios.get(url, { headers })
                .then(response => {
                    // Handle the response data here
                    console.log(response.data);
                    res.render("valid", { data: response.data });
                })
                .catch(error => {
                    // Handle any errors here
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error('Access token request failed:', error);
        });






    // res.render("main");
})

axios.get(apiUrl)
    .then((response) => {
        // Handle the response here
        console.log(apiUrl);
        // console.log('Response:', response.data);

    })
    .catch((error) => {
        // Handle any errors here
        console.error('Error:', error);
    });



app.get("/main", (req, res) => {
    axios.get(apiUrl)
        .then((response) => {
            // Handle the response here
            console.log(apiUrl);
            // console.log('Response:', response.data);

        })
        .catch((error) => {
            // Handle any errors here
            console.error('Error:', error);
        });

    res.redirect(apiUrl);
})



// app.get("/", (req, res) => {
//     const code = req.query.code;
//     console.log(code);
// })

app.listen(process.env.PORT || 2222, function() {
    console.log("server is running 2222");
});