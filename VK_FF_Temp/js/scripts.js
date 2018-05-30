import Filter from './friendFilter';
import FriendListBuilder from './friendListBuilder';
import FriendsManager from './FriendsManager';

let friendsGlobal = [];
let friendsLocal = [];

//Переносит друга из списка source в список target
let replaceFriendToTargetList = (source, target, friend) => {
    source.data = source.data.filter(item => {
        if (item.id != friend.id) {
            return item;
        }
    });

    //Добавляем данные о переносимом друге в массив friendsLocal
    target.data.push(friend);
    target.list.updateData(target.data);

    ///Удаляем переносимого друга из левого списка
    source.list.updateData(source.data);
};

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
        const templateFriend = document.querySelector('#user-template').textContent;
        const templateLocalFriend = document.querySelector('#user-local-template').textContent;
        const leftFriendList = document.querySelector('.friend-list.left-friend-list');
        const rightFriendList = document.querySelector('.friend-list.right-friend-list');

        friendsGlobal = allFfriends.items;
        friendsLocal = localStorage.friendsLocal ? JSON.parse(localStorage.friendsLocal) : []; //Массив локальных друзей

        //Если есть сохраненные друзья, фильтруем полученные данные, чтобы их исключить
        if (friendsLocal.length > 0) {
            friendsLocal.map(friend => {
                friendsGlobal = friendsGlobal.filter(item => {
                    return (item.id != friend.id);
                })
            })
        }

        let friendManager = new FriendsManager(friendsGlobal, friendsLocal);

        //Left friends list
        const friendsList = new FriendListBuilder(friendsGlobal, {
            templateEl: templateFriend,
            containerEl: leftFriendList
        });

        friendsList.render();

        //Right(local) friends list
        const friendsListLocal = new FriendListBuilder(friendsLocal, {
            templateEl: templateLocalFriend,
            containerEl: rightFriendList
        });

        friendsListLocal.render();

        //Filter
        const filterInput = document.querySelector('.friend-search-input');
        const friendsFilter = new Filter(filterInput, {
            data: friendsGlobal,
            fields: ['first_name', 'last_name'],
            targetEl: leftFriendList,
            template: templateFriend
        });

        friendsFilter.init();

		//Drag-n-Drop
        const dropZone = rightFriendList;

        leftFriendList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('friend-list-item')) {
                const self = e.target;
                const userData = JSON.stringify(self.dataset);

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('Text', userData);
            }
        });

		dropZone.addEventListener('drop', (e) => {
		    if (e.preventDefault) {
		        e.preventDefault();
            }

            let localFriendData = JSON.parse(e.dataTransfer.getData('Text'));

            friendManager.addToLocal(localFriendData);

            //Обновляем списки друзей
            friendsListLocal.updateData(friendManager.localData);
            friendsList.updateData(friendManager.globalData);

            //Обновляем фильтр друзей из левого блока
            friendsFilter.updateData(friendManager.globalData);
		});

		dropZone.addEventListener('dragover', (e) => {
		    if (e.preventDefault) {
                e.preventDefault();
            }

			e.dataTransfer.dropEffect = 'move';
		});

		//Обработчик добавления друга кликом по кнопке +
        document.querySelector('.friend-list-wrapper').addEventListener('click', e => {
           if (e.target.closest('.add-friend-button')) {
               const friendItem = e.target.closest('.friend');
               const friendItemDtata = friendItem.dataset;

               friendManager.addToLocal(friendItemDtata);

               //Обновляем списки друзей
               friendsListLocal.updateData(friendManager.localData);
               friendsList.updateData(friendManager.globalData);

               //Обновляем фильтр друзей из левого блока
               friendsFilter.updateData(friendManager.globalData);

           } else if (e.target.closest('.remove-friend-button')) {
               const friendItem = e.target.closest('.friend');
               const friendItemDtata = friendItem.dataset;

               friendManager.removeFromLocal(friendItemDtata);

               //Обновляем списки друзей
               friendsList.updateData(friendManager.globalData);
               friendsListLocal.updateData(friendManager.localData);

               //Обновляем фильтр друзей из правого блока
               //friendsFilter.updateData(friendsLocal);
           }
        });

		//Кнопка Сохранить
        const saveButton = document.querySelector('.save-button');

        saveButton.addEventListener('click', () => {
            let dataToSave = JSON.stringify(friendManager.localData);

            localStorage.setItem('friendsLocal', dataToSave);
        })
    });



