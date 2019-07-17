<template>
  <div>
    <b-img v-if=currentUser :src="userAvatar(currentUser._id)"></b-img>
    <h1 v-if="currentUser">Yo Whaddup {{currentUser.name}}!</h1>
    <h3 v-if="currentUser && filteredUsers.length > 0">You're here with <span v-for="user in filteredUsers" :key="user._id" >{{user.name}}, </span></h3>
    <h3 v-else-if="currentUser && filteredUsers.length === 0">You're in here all by your lonesome.</h3>
    <p v-if="isConnected">We're live.</p>
    <p v-if="!isConnected">The system is down.</p>

    <b-input-group v-if="!currentUser">
        <b-form-input  placeholder="What's yo name?" v-model="name"/>
        <b-input-group-append>
            <b-button variant="primary" @click="connectUser()">Connect!</b-button>
        </b-input-group-append>
    </b-input-group>

    <div v-if="!currentUser">
        <b-list-group v-for="user in offlineUsers" :key="user._id">
            <b-list-group-item @click="connectUser(user)">{{user.name}}</b-list-group-item>
        </b-list-group>
    </div>

    <div v-if="currentUser">
        <b-list-group v-for="event in eventList" :key="event.time">
            <b-list-group-item class="d-flex justify-content-between align-items-center">
                {{event.message}}
            </b-list-group-item>
        </b-list-group>
        <b-input-group>
            <b-form-input  placeholder="Say Stuff" v-model="message"/>
            <b-input-group-append>
                <b-button variant="primary" @click="sendMessage()">Chat!</b-button>
            </b-input-group-append>
        </b-input-group>
    </div>
  </div>
</template>

<script>

import { users } from '@/services/api.js'
// import { events } from '@/services/api.js'


export default {
    components: {
	},
    data () {
        return {
            isConnected: false,
            name: "",
            message: "",
            currentUser: null,
            userList: [],
            eventList: [],
            offlineUsers: []
        }
    },
    sockets: {
        connect() {
            this.isConnected = true;
        },
        disconnect() {
            this.isConnected = false;
        },
        newEvent(event) {
            // eslint-disable-next-line
            console.log('this thing on?')
            this.eventList.push(event)
        },
        currentUsers(users) {
            // eslint-disable-next-line
            console.log('users')
            // eslint-disable-next-line
            console.log(users)
            this.userList = users
        }
    },
    created() {
        // document.addEventListener("beforeunload", () => this.disconnectUser)
        window.addEventListener("beforeunload", this.disconnectUser)
    },
    async mounted() {
        this.setOfflineUsers()
    },
    computed: {
        filteredUsers: function() {  
            // eslint-disable-next-line
            console.log('filtering')
            return this.userList.filter(user => user._id !== this.currentUser._id)
        },
        userAvatar: function() {
            return (id) => `https://api.adorable.io/avatars/285/${id}.png`
        },
        isOwnEvent: function(event) {
            return event._id === this.currentUser._id 
        }
    },
	methods: {
        async connectUser(user) {
            if(!user) {
                this.currentUser = await users.create({name: this.name})
            } else {
                this.currentUser = user
            }
            this.$socket.emit('userJoined', this.currentUser)
            this.currentUser.isOnline = true
            this.name = ""
        },
        disconnectUser() {
            if(this.currentUser.name) {
                this.$socket.emit('userLeft', this.currentUser)
            }
        },
        sendMessage() {
            let newMessage = {
                message: this.message,
                type: 'message',
                user: this.currentUser
            }
            this.$socket.emit('eventSent', newMessage)
            this.message = ""
        },
        async setOfflineUsers() {
            this.offlineUsers = await users.list({isOnline:false})
        }
    }
}
</script>