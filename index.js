const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' }); 
const db = require("./db");
const auth = require("./auth.js");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const compression = require('compression');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');
const s3 = require("./s3")


//______________________________________________________________________________________________________________________________________________

app.use(express.static("./public"));
app.use(compression());

//---------------cookieSession------------------------------------------
const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//---------------cookieSession------------------------------------------

app.use(bodyParser.json());
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//------------------------------------------------------------------------------
if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//------------------------------------------------------------------------------

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// ----------------------------------------------------------------------------
function requireLoggedInUser( req, res, next) {
    if (!req.session.userId) {
        res.sendStatus(403);
    } else {
        next();
    }
};
//______________________________________________________________________________________________________________________________________________




//________________________________________________________________________LOGIN_________________________________________________________________
app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    // console.log("email: ", email);
    // console.log("password: ", password);
    db.getPassword(email).then(results => {
        // console.log("results: ", results);
        if (results.rows.length == 0) {
            res.json({ success: false })
      } else {
          req.session.userId = results.rows[0].id;
          auth
            .checkPassword(req.body.password, results.rows[0].password)
            .then(data => {
              if (data == true) {
                  res.json({ success: true });
              } else {
                  res.json({ success: false })
              }
          })
      }
  });
});
//________________________________________________________________________LOGIN_________________________________________________________________



//_____________________________________________________________________ REGISTER________________________________________________________________
// app.post('/register', async (req, res) => {
//
//     try {
//         let hashedPass = await
//         auth.hashPassword(req.body.password)
//
//         let results = await
//         db.createUser(req.body.first, req.body.last, req.body.email, hashedPass)
//
//         req.session.userId = results.rows[0].id;
//         req.session.first = results.rows[0].first;
//         res.json({ success: true });
//     } catch (err) {
//         console.log("error: ", err);
//     }
//
// });

// async function makePizza() {
//     // await makeDough()
//     // await makeSauce()
//     // await grateCheese()
//     let dough = makeDough()
//     let sauce = makeSauce()
//     let cheese = grateCheese()
//     return {
//         dough: await dough,
//         sauce: await sauce,
//         cheese: await cheese
//     }
// }
app.post("/register", (req, res) => {
    // console.log("test");
    if (
        req.body.first &&
        req.body.last &&
        req.body.email &&
        req.body.password
    ) {
        auth.hashPassword(req.body.password).then(hash => {
            let first = req.body.first;
            let last = req.body.last;
            let email = req.body.email;
            // console.log("first: ", first);
            // console.log("last: ", last);
            // console.log("email: ", email);
            // console.log("hash: ", hash);
            db.createUser(first, last, email, hash)
            .then(results => {
                // console.log("results: ", results);
                req.session.userId = results.rows[0].id;
                req.session.first = results.rows[0].first;
                res.json({ success: true });
                // console.log("session id: ", req.session.userId)
                // console.log("session first: ", req.session.first)
            })
            .catch(err => {
                console.log("error register: ", err);
                res.json({ success: false });
            });
        });

    } else {
        res.json({ success: false });
    }

});
//_____________________________________________________________________ REGISTER________________________________________________________________



//_______________________________________________________________________PROFILE________________________________________________________________
app.get('/user', requireLoggedInUser, (req, res) => {
    let userId = req.session.userId
    // console.log("userId: ", userId);
    db.info(userId)
        .then(results => {
            // console.log("results user: ", results);
            // console.log("rows: ", rows);
            const user = results.rows.pop();
            // console.log("user: ", user);
            if (!user.picurl) {
                user.picurl = './images/default.png';
            };
            res.json(user);
        }).catch(err => {
            console.log("error user: ", err);
        })
});
//____________________________________________________________________PROFILE___________________________________________________________________


//______________________________________________________________UPLOAD ProfilePic_______________________________________________________________
app.post('/upload', uploader.single('file'), s3.upload, function(req, res) {
    let id = req.session.userId;
    let picurl = 'https://s3.amazonaws.com/01socialnet/' + req.file.filename;
    db.uploadPic(picurl, id)
        .then(results => {
            // console.log("id: ", req.session.userId);
            // console.log("upload results: ", results);
            // console.log("results.rows: ", results.rows);
        res.json(results.rows);
    }).catch(err => {
        console.log("error upload: ", err);
    })
});
//______________________________________________________________UPLOAD ProfilePic_______________________________________________________________



//__________________________________________________________________BioEditor___________________________________________________________________
app.post('/bioeditor', (req, res) => {
    let bio = req.body.bio;
    let user_id = req.session.userId
    db.bio(bio, user_id)
        .then(results => {
            // console.log("bio results: ", results);
            // res.json(results.rows[0])
            const user = results.rows.pop();
            // console.log("user");
            res.json(user)
        }).catch(err => {
            console.log("bio error: ", err);
        })
});
//_________________________________________________________________BioEditor____________________________________________________________________



//_______________________________________________________________OTHERPROFILE___________________________________________________________________
app.get("/users/:id", requireLoggedInUser, (req, res) => {
    let id = req.session.userId
    let pId = req.params.id
    // console.log("id: ", id);
    // console.log("pId: ", pId);
    if ( pId != id) {
    db.info(pId)
        .then(results => {
            const user = results.rows.pop();
            if (user.picurl == null) {
                user.picurl = '/images/default.png';
            }
            // console.log("user: ", user);
            res.json(user);
        }).catch(err => {
            // console.log("error users/id: ", err);
            res.json({
                err: true
            });
        });
    } else {
        res.json({
            err: true
        });
    }
});
//_______________________________________________________________OTHERPROFILE___________________________________________________________________



//______________________________________________________________MAKING_FRIENDS__________________________________________________________________

app.get('/get-initial-status/:id', (req, res) => {
    // do db query to get inital status of friendship
    // once we get that initial status, res.json it back to the FriendButton component
    // console.log(" /get-inital running!!");
    let id = req.session.userId
    let pId = req.params.id
    // console.log("id get-inital: ", id);
    // console.log("pId get-inital: ", pId);
    db.getFriendship(id, pId)
        .then(results => {
            // console.log("results /get-inital/ : ", results );
            res.json(results);
        }).catch(err => {
            console.log("error /get-initial-status/: ", err);
        })
});




//--------------------------FRIEND_REQUEST--------------------------------------
app.post('/friendrequest/:id', (req, res) => {
    let id = req.session.userId
    let pId = req.params.id
    // console.log("id friendrequest: ", id);
    // console.log("pId friendrequest: ", pId);
    db.friendRequest(id, pId)
        .then(results => {
            // console.log("results /friendrequest: ", results);
            res.json(results);
        }).catch(err => {
            console.log("error /friendrequest/: ", err);
        });
    });
//--------------------------FRIEND_REQUEST--------------------------------------



//------------------------ACCEPT_FRIEND_REQUEST---------------------------------
app.post('/acceptfriendship/:id', (req, res) => {
    let id = req.session.userId
    let pId = req.params.id
    // console.log("id acceptfriendship: ", req.session.userId);
    // console.log("pId acceptfriendship: ", pId);
    db.acceptFriend (id, pId)
        .then(results => {
            // console.log("results /acceptfriendship/: ", results);
            res.json(results);
        }).catch(err => {
            console.log("error /acceptfriendship/:" , err);
        });
    });
//------------------------ACCCEPT_FRIEND_REQUEST--------------------------------



//------------------------CANCEL_FRIEND_REQUEST---------------------------------
app.post('/cancelfriendship/:id', (req,res) => {
    let id = req.session.userId
    let pId = req.params.id
    // console.log("id cancelfriendship: ", id);
    // console.log("pId cancelfriendship: ", pId);
    db.cancelFriend (id, pId)
        .then(results => {
            // console.log("results /cancelfriendship/: ", results);
            res.json(results);
        }).catch(err => {
            console.log("error /cancelfriendship/: ", err);
        });
    });
//------------------------CANCEL_FRIEND_REQUEST---------------------------------

//_______________________________________________________________MAKING_FRIENDS_________________________________________________________________



//___________________________________________________________________GET_ALL_FRIENDS____________________________________________________________
app.get('/friends_wannabes', (req, res) => {
    let id = req.session.userId
    // console.log("id friends_wannabes: ", id);
    db.allFriends(id)
        .then(results => {
            // console.log("results /friends_wannabes: ", results.rows);
            res.json(results.rows);
        }).catch(err => {
            console.log("error /friends_wannabes: ", err);
        });
});
//___________________________________________________________________GET_ALL_FRIENDS____________________________________________________________

//______________________________________________________________LOGOUT_________________________________________________________________________

app.post("/logout", (request, response) => {
    // console.log("I wanna log out");
    request.session = null;
    response.send({ success: "happy" });
});

//______________________________________________________________LOGOUT_________________________________________________________________________



app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + "/index.html")
    }
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + '/index.html')
    }
});

//______________________________________________________________________________

server.listen(8080, function() { console.log("I'm listening."); });

//______________________________________________________________________________


//_________________________________SOCKET.IO____________________________________


//--------------------------USERS_ONLINE----------------------------------------
const onlineUsers = {};
const userIds = [];

io.on('connection', socket => {
    const {userId} = socket.request.session;
    // console.log("socket.id: ", socket.id);
    // console.log("userId: ", userId);
    if (!userId) {
        return socket.disconnect();
    }

    onlineUsers[socket.id] = userId;
    // console.log(onlineUsers);

    db.onlineUsers(Object.values(onlineUsers))
        .then( ({rows}) => {
            // console.log("rows: ", rows);
            socket.broadcast.emit('onlineUsers', {
                onlineUsers: rows.filter(rows => rows.id != userId)
            });
            // console.log("onlineUsers.rows: ", onlineUsers);
    });

    const alreadyHere = Object.values(onlineUsers).filter (id => id != userId).length > 1;

    if (!alreadyHere){
        db.info(userId).then(({rows}) => {
            // console.log("rows: ", rows[0]);
            socket.broadcast.emit('userJoined', {
                user: rows[0]
            })
        })
        // console.log("userJoined");
    }

    //--------------------------------CHAT------------------------------------------
        db.getchatMessages()
            .then( ({rows}) => {
                // console.log("getchatMessages rows: ", rows);
                socket.broadcast.emit('newChatMessage', rows.reverse());
            }).catch (err => {
                console.log("getchatMessages error: ", err);
            });


        socket.on('newChatMessage', data => {
            // console.log("data in newChatMessage: ", data);
            // console.log("newMessage userId: ", userId);
            db.newMessage(userId, data)
                .then(({rows}) => {
                    // console.log("newMessage rows: ", rows);
                    db.getchatMessages()
                        .then( ({rows}) => {
                            // console.log("getchatMessages rows: ", rows);
                            io.emit('newChatMessage', rows.reverse())
                        });
                }).catch(err => {
                    console.log("newMessage error: ", err);
                })
                //push to the array chatMessages or in db
                // db query to get info about the person who posted the message!

            });


    //--------------------------------CHAT------------------------------------------



    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        for (var p in onlineUsers) {
            if(userIds.hasOwnProperty(p)) {
                var pValue = onlineUsers[p]
                userIds.push(pValue)
            }
        }
        if (!userIds.includes(userId)) {
            socket.broadcast.emit('userLeft', userId)
            // console.log("disconnect");
        }
    })
//--------------------------USERS_ONLINE----------------------------------------



});
