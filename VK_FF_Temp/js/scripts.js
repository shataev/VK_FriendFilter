VK.init({
    apiId: 6489428
    }
);

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error("Not connected"));
            }
        })
    }, 2)
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
}

auth()
    .then(() => {
        return callAPI('friends.get', {fields: 'photo_100'})
    })
    .then(friends => {
        const template = document.querySelector('#user-template').textContent;
        const render = Handlebars.compile(template);
        const html = render({items: friends.items});
        const results = document.querySelector('.left-list-container.friend-list-container');
        let friendListEl = document.createElement('div');

        friendListEl.innerHTML = html;
        results.appendChild(friendListEl);
    });