import axiosWrapper from '../axiosWrapper';
// import config from '../../config';


export function getUser(token, callback) {
    if (!token) {
        return callback(false);
    }
    axiosWrapper
        .get(`user/loginWithToken`)
        .then(function (response) {
            if (response.status === 200) {
                callback({user: response.data});
                console.log(response);
            } else {
                callback(false);
            }
        })
        .catch(function (err) {
            //   console.log(err);
            callback(false);
        });
}
//  return callback(false);
//request()
// Rather than immediately returning, we delay our code with a timeout to simulate asynchronous behavior
// setTimeout(() => {
//   callback({
//     name : 'John Smith',
//     dept : 'Web Team',
//     lastLogin : new Date(),
//     email : 'john@smith.com',
//     id : 'abcde1234'
//   });
// }, 500);

// In the case of a real world API call, you'll normally run into a Promise like this:
// API.getUser().then(user => callback(user));