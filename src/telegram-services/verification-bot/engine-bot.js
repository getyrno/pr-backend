require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const users = {}; // Хранилище пользователей в памяти

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('Telegram Bot Token not provided!');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const languages = {
    ENG: {
        welcome: 'Welcome! Please choose your language:',
        phone: 'Please enter your phone number:',
        password: 'Please enter your password:',
        registered: 'You are registered! You will receive codes here.',
        invalidPassword: 'Invalid password. Please try again.',
        codeSent: 'Your verification code is: ',
        help: 'To register, send /start. To stop receiving codes, send /unsubscribe.',
        unsubscribed: 'You have unsubscribed from receiving codes.',
    },
    RUS: {
        welcome: 'Добро пожаловать! Пожалуйста, выберите ваш язык:',
        phone: 'Введите номер вашего телефона:',
        password: 'Введите ваш пароль:',
        registered: 'Вы зарегистрированы! Вы будете получать коды здесь.',
        invalidPassword: 'Неправильный пароль. Пожалуйста, попробуйте снова.',
        codeSent: 'Ваш код подтверждения: ',
        help: 'Для регистрации отправьте /start. Чтобы прекратить получение кодов, отправьте /unsubscribe.',
        unsubscribed: 'Вы отписались от получения кодов.',
    }
};

// Кнопки выбора языка
const languageOptions = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'English', callback_data: 'ENG' }],
            [{ text: 'Русский', callback_data: 'RUS' }]
        ]
    }
};

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    users[chatId] = { step: 'language' };
    console.log(`User with chat ID ${chatId} started the bot`);
    bot.sendMessage(chatId, 'Welcome! Please choose your language:', languageOptions);
});

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    if (users[chatId] && users[chatId].language) {
        const language = users[chatId].language;
        bot.sendMessage(chatId, languages[language].help);
    } else {
        bot.sendMessage(chatId, 'Please start with /start');
    }
});

// Обработка команды /unsubscribe
bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (users[chatId]) {
        delete users[chatId];
        bot.sendMessage(chatId, 'You have unsubscribed from receiving codes.');
    } else {
        bot.sendMessage(chatId, 'You are not subscribed.');
    }
});

// Обработка нажатий на кнопки
bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const text = callbackQuery.data;

    if (!users[chatId]) {
        bot.sendMessage(chatId, 'Please start with /start');
        return;
    }

    const user = users[chatId];

    if (user.step === 'language') {
        if (text === 'ENG' || text === 'RUS') {
            user.language = text;
            user.step = 'phone';
            console.log(`User with chat ID ${chatId} chose language ${text}`);
            bot.sendMessage(chatId, languages[user.language].phone);
        } else {
            bot.sendMessage(chatId, 'Please choose a valid language: ENG or RUS');
        }
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (!users[chatId] || users[chatId].step === 'language') {
        // Игнорируем сообщения, если язык не выбран или пользователь еще не начал процесс
        return;
    }

    const user = users[chatId];

    if (user.step === 'phone') {
        if (/^\d+$/.test(text)) {
            user.phoneNumber = text.replace(/\D/g, ''); // Сохраняем номер телефона без нецифровых символов
            user.step = 'password';
            console.log(`User with chat ID ${chatId} entered phone number ${user.phoneNumber}`);
            bot.sendMessage(chatId, languages[user.language].password);
        } else {
            bot.sendMessage(chatId, languages[user.language].phone);
        }
    } else if (user.step === 'password') {
        user.password = text;
        user.step = 'registered';
        console.log(`User with chat ID ${chatId} registered with phone number ${user.phoneNumber}`);
        bot.sendMessage(chatId, languages[user.language].registered);
    } else if (user.step === 'registered') {
        bot.sendMessage(chatId, 'You are already registered and will receive codes here.');
    }
});

// Функция для отправки кода пользователю
const sendCodeToUser = (phoneNumber, code) => {
    const normalizedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Нормализуем номер телефона
    console.log(`Trying to send code to user with phone number: ${normalizedPhoneNumber}`);

    const userChatId = Object.keys(users).find(chatId => users[chatId].phoneNumber === normalizedPhoneNumber);
    if (!userChatId) {
        console.error(`User with phone number ${normalizedPhoneNumber} not found`);
        return;
    }

    console.log(`Found user with chat ID: ${userChatId}`);
    const user = users[userChatId];
    if (user && user.step === 'registered') {
        const language = user.language;
        bot.sendMessage(userChatId, languages[language].codeSent + code);
    } else {
        console.error(`User with chat ID ${userChatId} is not registered or not in correct step`);
    }
};

// Экспорт функции для отправки кода
module.exports = {
    sendCodeToUser,
};
