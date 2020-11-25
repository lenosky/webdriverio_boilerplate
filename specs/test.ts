import { _$, _$$ } from '../lib/lazy.elements';
import { Login } from '../framework/pages/login';

describe('gitHub login page', () => {
    const loginPage = new Login();

    before(() => loginPage.navigateAndWaitToLoad());

    it('should have correct error message with logging in with incorrect pass', async () => {
        await loginPage.loginWithCreds({login: 'login', password: 'password'});
        expect(await loginPage.getErrorMessage()).toEqual('Incorrect username or password.');
    })
});
