// services/smsService.js
const { SmsAero, SmsAeroError, SmsAeroHTTPError } = require('smsaero');

class SmsService {
  constructor(email, apiKey) {
    this.client = new SmsAero(email, apiKey);
    console.log("this.client.email:",this.client.email);
    console.log("this.client.apiKey:",this.client.apiKey);
  }

  async sendVerificationCode(phoneNumber, verificationCode) {
    console.log("phoneNumber:",phoneNumber);
    console.log("verificationCode:",verificationCode);

    try {
      const message = `Your verification code: ${verificationCode}`;
      const response = await this.client.send(phoneNumber, message);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send verification code: ${error.message}`);
    }
  }

  generateVerificationCode() {
    const codeLength = 6;
    const characters = '0123456789';
    let verificationCode = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      verificationCode += characters.charAt(randomIndex);
    }
    return verificationCode;
  }
}

module.exports = SmsService;
