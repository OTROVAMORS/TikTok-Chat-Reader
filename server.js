require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');
const { clientBlocked } = require('./limiter');
const { 
    handleBravo, 
    handleRose, 
    handleHealthPotion, 
    handleTennis, 
    handleLoveLetter, 
    handleAlienPeaceSign, 
    handleFootball, 
    handleGG, 
    handleHiJuly, 
    handleMiniSpeaker, 
    handleLightningBolt, 
    handleCoffee, 
    handleIceCreamCone, 
    handleWeights, 
    handleTikTokLogo, 
    handleGardenGnome, 
    handleSquirrel, 
    handleDaisies, 
    handlePinkShoes, 
    handleDuckling, 
    handleChic, 
    handlePandas, 
    handleFingerHeart, 
    handleMic, 
    handleHi, 
    handleCottonsShell,
    handleDanceTogether,
    handleGoose,
    handleLoveBalloon,
    handleSwan,
    handleTikTokTrophy,
    handleShoes,
    handleSilverGummy,
    handlePearl,
    handleTrain,
    handleBadminton,
    handleTravelWithYou,
    handleDinosaur,
    handleDiscoBall,
    handleEmailMessage,
    handleGalaxy,
    handleGerryTheGiraffe,
    handleGoldGummy,
    handleGoldMine,
    handleMagicLamp,
    handleMirrorFlower,
    handleSpace,
    handleWatermelonLove,
    handleDiamondTree,
    handleFireworks,
    handleDiamond,
} = require('./GiftResponse');

const app = express();
const httpServer = createServer(app);

// Enable cross-origin resource sharing
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    let tiktokConnectionWrapper;

    console.info('New connection from origin', socket.handshake.headers['origin'] || socket.handshake.headers['referer']);

    socket.on('setUniqueId', (uniqueId, options) => {
        // Prohibit the client from specifying these options (for security reasons)
        if (typeof options === 'object' && options) {
            delete options.requestOptions;
            delete options.websocketOptions;
        } else {
            options = {};
        }

        // Session ID in .env file is optional
        if (process.env.SESSIONID) {
            options.sessionId = process.env.SESSIONID;
            console.info('Using SessionId');
        }

        // Check if rate limit exceeded
        if (process.env.ENABLE_RATE_LIMIT && clientBlocked(io, socket)) {
            socket.emit('tiktokDisconnected', 'You have opened too many connections or made too many connection requests. Please reduce the number of connections/requests or host your own server instance. The connections are limited to avoid that the server IP gets blocked by TikTok.');
            return;
        }

        // Connect to the given username (uniqueId)
        try {
            tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
            tiktokConnectionWrapper.connect();
        } catch (err) {
            socket.emit('tiktokDisconnected', err.toString());
            return;
        }

        // Redirect wrapper control events once
        tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
        tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

        // Notify the client when the stream ends
        tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

        // Redirect message events
        tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
        tiktokConnectionWrapper.connection.on('member', msg => socket.emit('member', msg));
        tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
        tiktokConnectionWrapper.connection.on('gift', msg => {
            // Check if it's a valid gift
            if (msg.giftName) {
                const giftName = msg.giftName;
                console.log(`gift: ${giftName} received`);
                // Check if there's a handling function for this gift name
                switch (giftName) {
                    case 'Bravo':
                        handleBravo();
                        break;
                    case 'Rose':
                        handleRose();
                        break;
                    case 'Health Potion':
                        handleHealthPotion();
                        break;
                    case 'Tennis':
                        handleTennis();
                        break;
                    case 'Love Letter':
                        handleLoveLetter();
                        break;
                    case 'Alien Peace Sign':
                        handleAlienPeaceSign();
                        break;
                    case 'Football':
                        handleFootball();
                        break;
                    case 'GG':
                        handleGG();
                        break;
                    case 'Hi July':
                        handleHiJuly();
                        break;
                    case 'Mini Speaker':
                        handleMiniSpeaker();
                        break;
                    case 'Lightning Bolt':
                        handleLightningBolt();
                        break;
                    case 'Coffee':
                        handleCoffee();
                        break;
                    case 'Ice Cream Cone':
                        handleIceCreamCone();
                        break;
                    case 'Weights':
                        handleWeights();
                        break;
                    case 'TikTok Logo':
                        handleTikTokLogo();
                        break;
                    case 'Garden Gnome':
                        handleGardenGnome();
                        break;
                    case 'Squirrel':
                        handleSquirrel();
                        break;
                    case 'Daisies':
                        handleDaisies();
                        break;
                    case 'Pink Shoes':
                        handlePinkShoes();
                        break;
                    case 'Duckling':
                        handleDuckling();
                        break;
                    case 'Chic':
                        handleChic();
                        break;
                    case 'Pandas':
                        handlePandas();
                        break;
                    case 'Finger Heart':
                        handleFingerHeart();
                        break;
                    case 'Mic':
                        handleMic();
                        break;
                    case 'Hi':
                        handleHi();
                        break;
                    case 'Cotton’s Shell':
                        handleCottonsShell();
                        break;
                    // Handle cases for the additional gifts here
                    case 'Dance Together':
                        handleDanceTogether();
                        break;
                    case 'Goose':
                        handleGoose();
                        break;
                    case 'LOVE Balloon':
                        handleLoveBalloon();
                        break;
                    case 'Swan':
                        handleSwan();
                        break;
                    case 'TikTok Trophy':
                        handleTikTokTrophy();
                        break;
                    case 'Shoes':
                        handleShoes();
                        break;
                    case 'Silver Gummy':
                        handleSilverGummy();
                        break;
                    case 'Pearl':
                        handlePearl();
                        break;
                    case 'Train':
                        handleTrain();
                        break;
                    case 'Badminton':
                        handleBadminton();
                        break;
                    case 'Travel With You':
                        handleTravelWithYou();
                        break;
                    case 'Dinosaur':
                        handleDinosaur();
                        break;
                    case 'Disco Ball':
                        handleDiscoBall();
                        break;
                    case 'Email Message':
                        handleEmailMessage();
                        break;
                    case 'Galaxy':
                        handleGalaxy();
                        break;
                    case 'Gerry the Giraffe':
                        handleGerryTheGiraffe();
                        break;
                    case 'Gold Gummy':
                        handleGoldGummy();
                        break;
                    case 'Gold Mine':
                        handleGoldMine();
                        break;
                    case 'Magic Lamp':
                        handleMagicLamp();
                        break;
                    case 'Mirror Flower':
                        handleMirrorFlower();
                        break;
                    case 'Space':
                        handleSpace();
                        break;
                    case 'Watermelon Love':
                        handleWatermelonLove();
                        break;
                    case 'Diamond Tree':
                        handleDiamondTree();
                        break;
                    case 'Fireworks':
                        handleFireworks();
                        break;
                    case 'Diamond':
                        handleDiamond();
                        break;
                    default:
                        console.log(`Unhandled gift: ${giftName}`);
                }
            }
        });
        tiktokConnectionWrapper.connection.on('social', msg => socket.emit('social', msg));
        tiktokConnectionWrapper.connection.on('like', msg => socket.emit('like', msg));
        tiktokConnectionWrapper.connection.on('questionNew', msg => socket.emit('questionNew', msg));
        tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socket.emit('linkMicBattle', msg));
        tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socket.emit('linkMicArmies', msg));
        tiktokConnectionWrapper.connection.on('liveIntro', msg => socket.emit('liveIntro', msg));
        tiktokConnectionWrapper.connection.on('emote', msg => socket.emit('emote', msg));
        tiktokConnectionWrapper.connection.on('envelope', msg => socket.emit('envelope', msg));
        tiktokConnectionWrapper.connection.on('subscribe', msg => socket.emit('subscribe', msg));
    });

    socket.on('disconnect', () => {
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }
    });
});

// Emit global connection statistics
setInterval(() => {
    io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000);

// Serve frontend files
app.use(express.static('public'));

// Start HTTP listener
const port = process.env.PORT || 8081;
httpServer.listen(port);
console.info(`Server running! Please visit http://localhost:${port}`);
