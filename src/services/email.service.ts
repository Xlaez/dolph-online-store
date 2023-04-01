import config from '@/configs';
import { messages } from '@/constants/messages.constant';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { createTransport } from 'nodemailer';
import mjml2html from 'mjml';
import { resolve } from 'path';

const activateAccount = readFileSync(resolve(__dirname, '../../templates/activate-account.mjml')).toString();
const activateAccountTemplate = compile(mjml2html(activateAccount).html);

const transport = createTransport({
  service: 'gmail',
  auth: {
    type: 'Login',
    user: config.email.apps,
    pass: config.email.password,
  },
});

class MailSender {
  private to: string;
  private subject: string;
  private payload: { name: string; digits: string; link: string };
  private html: string;
  constructor(to: string, subject: string, payload: { name: string; digits: string; link: string }) {
    this.to = to;
    this.subject = subject;
    this.payload = payload;
  }

  public async sendMail() {
    switch (this.subject) {
      case messages.validateAcc:
        this.html = activateAccountTemplate({
          name: this.payload.name,
          digits: this.payload.digits,
          link: this.payload.link,
        });
        break;
    }
    const emailObj = { from: config.email.from, to: this.to, subject: this.subject, html: this.html };
    return transport.sendMail(emailObj);
  }
}

export default MailSender;
