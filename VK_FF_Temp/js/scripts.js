import Filter from './friendFilter';
import FriendListBuilder from './friendListBuilder';

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
    .then(allFfriends => {
        let friends = allFfriends.items;
        let localFriends = localStorage.localFriends ? JSON.parse(localStorage.localFriends) : []; //Массив локальных друзей
        const templateFriend = document.querySelector('#user-template').textContent;
        const templateLocalFriend = document.querySelector('#user-local-template').textContent;
        const leftFriendList = document.querySelector('.friend-list.left-friend-list');
        const rightFriendList = document.querySelector('.friend-list.right-friend-list');

        //Если есть сохраненные друзья, фильтруем полученные данные, чтобы их исключить
        if (localFriends.length > 0) {
            localFriends.map(friend => {
                friends = friends.filter(item => {
                    return (item.id !== +friend.id);
                })
            })
        }

        //Left friends list
        const friendsList = new FriendListBuilder(friends, {
            templateEl: templateFriend,
            containerEl: leftFriendList
        });

        friendsList.render();

        //Right(local) friends list
        const friendsListLocal = new FriendListBuilder(localFriends, {
            templateEl: templateLocalFriend,
            containerEl: rightFriendList
        });

        friendsListLocal.render();

        //Filter
        const filterInput = document.querySelector('.friend-search-input');
        const friendsFilter = new Filter(filterInput, {
            data: friends,
            fields: ['first_name', 'last_name'],
            targetEl: leftFriendList,
            template: templateFriend
        });

        friendsFilter.init();

        /*filterInput.addEventListener('keyup', e => {
            results.innerHTML = null;

            let filterValue = filterInput.value;
            let filteredFriends;

            if (!filterValue) {
                filteredFriends = friends.items;
            } else {
                filteredFriends = friends.items.filter(friend => {
                    return (isMatching(friend.first_name, filterValue) || isMatching(friend.last_name, filterValue));
                });
            }

            const newHtml = render({items: filteredFriends});

            results.innerHTML = newHtml;
        });*/

		//Drag-n-Drop
        const dropZone = rightFriendList;

        leftFriendList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('friend-list-item')) {
                const self = e.target;
                const userData = JSON.stringify(self.dataset);

                e.dataTransfer.effectAllowed = 'move';
                //e.dataTransfer.setData('Text', self.outerHTML);
                e.dataTransfer.setData('Text', userData);

                ///Готовим переносимого друга на удаление из левого списка
                const friendId = +self.id;

                friends = friends.filter(item => {
                    if (item.id !== friendId) {
                        return item;
                    }
                });
            }
        });

		dropZone.addEventListener('drop', (e) => {
		    if (e.preventDefault) {
		        e.preventDefault();
            }

            //Добавляем данные о переносимом друге в массив localFriends
            let localFriendData = JSON.parse(e.dataTransfer.getData('Text'));

		    localFriends.push(localFriendData);
            friendsListLocal.updateData(localFriends);

            ///Удаляем переносимого друга из левого списка
            friendsList.updateData(friends);

            //Обновляем фильтр друзей из левого блока
            friendsFilter.updateData(friends);
		});

		dropZone.addEventListener('dragover', (e) => {
		    if (e.preventDefault) {
                e.preventDefault();
            }

			e.dataTransfer.dropEffect = 'move';
		});

		//Кнопка Сохранить
        const saveButton = document.querySelector('.save-button');

        saveButton.addEventListener('click', () => {
            let dataToSave = JSON.stringify(localFriends);

            localStorage.setItem('localFriends', dataToSave);
        })
    });

