import { _$, _$$ } from '../../lib/lazy.elements';

export class Login {
    private loginField;
    private passwordField;
    private signInBtn;
    private errorMessage;
    private url = '/login';

    constructor() {
        this.loginField = _$('#login_field');
        this.passwordField = _$('#password');
        this.signInBtn = _$('input.btn-primary.btn-block');
        this.errorMessage = _$('div[id=js-flash-container] div.container-lg');
    }

    setLoginField(login) {
        return this.loginField.setValue(login);
    }

    setPasswordField(password) {
        return this.passwordField.setValue(password);
    }

    clickSignInBtn() {
        return this.signInBtn.click();
    }

    getErrorMessage() {
        return this.errorMessage.getText();
    }

    async loginWithCreds({login, password}) {
        if (login) await this.setLoginField(login);
        if (password) await this.setPasswordField(password);
        
        return this.clickSignInBtn();
    }

    async navigateAndWaitToLoad(timeout = 10000) {
        await browser.url(this.url);
        
        return this.signInBtn.waitForClickable({timeout});
    }
}