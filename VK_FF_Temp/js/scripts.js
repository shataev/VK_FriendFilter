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
        const results = document.querySelector('.friend-list.left-friend-list');
        const dropZone = document.querySelector('.friend-list.right-friend-list');

		results.innerHTML = html;

        results.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('friend-list-item')) {
                let self = e.target;
				e.dataTransfer.effectAllowed = 'move';
				e.dataTransfer.setData('Text', self.outerHTML);
            }
        });

		dropZone.addEventListener('drop', (e) => {
            dropZone.innerHTML += e.dataTransfer.getData('Text');
		});

		dropZone.addEventListener('dragover', (e) => {
		    if (e.preventDefault) {
                e.preventDefault();
            }

			e.dataTransfer.dropEffect = 'move';
		});
    });

