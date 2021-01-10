import axios from 'axios'
import config from '../config';

const chatBotInstance = axios.create({
    baseURL: config.CHATBOT.BASE_URL,
    timeout: 3000,
    responseType: 'json'
});

const chatbot = (userId, message, res) => {
    chatBotInstance.get(`${userId}/${message}`).then(
        data =>  res({
            success: true,
            message: data.data.response
        })
    ).catch(err => {
        console.log(err);
        res({
            success: false,
            message: "Eww, I am facing trouble chatting with you. Try again later!"
        });
    }
    );
}

export default chatbot;