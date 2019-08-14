![](bad-signal.gif)

# Bad Signal
_A surprisingly accurate chat app._

## Why?
Mostly, I just wanted to play around with sockets. The traditional server endpoints follow a REST architecture. On the client side, I needed a way to save the state of `currentUser`, but felt that using [Vuex](https://vuex.vuejs.org/) would be overkill. Taking advantage of the browser's session storage seemed work just fine. I also heavily borrowed the UI from [this](https://codepen.io/drehimself/pen/KdXwxR) codepen.

## Stack Used
Built on a MEVN stack _(Mongo, Express, Vue, Node)_. _Socket.io_ handles the sockets. On the front end, _Axios_ makes the HTTP Requests easier, and _SCSS_ helps out with the styling.


## To Run

First, you'll need MongoDB installed and running. [These guys](https://docs.mongodb.com/manual/installation/) seemed to know what they're talkin' about.

Next, we’ll need to get the node server fired up. From the project him directory, head to the server directory (`cd server/`) and run an `npm install`. Next, you have two options. 
`npm run start` will start the server normally. `npm run dev` will start with nodemon, which’ll pick up any changes you may make to the code.

Once the server is started, open another terminal window and head to the client directory (`cd client/bad-signal`). After an `npm install`, `npm run serve` should do to the trick.

Now, head to `http://localhost:8080` and start chatting!
