import {isMatching, sortFriends, replaceFriend} from "./helpers";
import FriendListBuilder from './friendListBuilder';
import DragDrop from './DnD';

let friendsGlobal = [];
let friendsLocal = [];

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

        friendsGlobal = allFfriends.items.sort(sortFriends);
        friendsLocal = localStorage.friendsLocal ? JSON.parse(localStorage.friendsLocal).sort(sortFriends) : []; //Массив локальных друзей

        //Если есть сохраненные друзья, фильтруем полученные данные, чтобы их исключить
        if (friendsLocal.length > 0) {
            friendsLocal.map(friend => {
                friendsGlobal = friendsGlobal.filter(item => {
                    return (item.id != friend.id);
                })
            })
        }

		//Build friendLsts
		const friendsGlobalFilterInput = document.querySelector('.friend-search-input');
		const friendsGlobalFilterOPtions = {
			el: friendsGlobalFilterInput,
			fields: ['first_name', 'last_name']
		};
		const friendsLocalFilterInput = document.querySelector('.friend-filter-input');
		const friendsLocalFilterOPtions = {
			el: friendsLocalFilterInput,
			fields: ['first_name', 'last_name']
		};

		let friendsGlobalList = new FriendListBuilder (friendsGlobal, templateFriend, leftFriendList, friendsGlobalFilterOPtions);
		let friendsLocalList = new FriendListBuilder (friendsLocal, templateLocalFriend, rightFriendList, friendsLocalFilterOPtions);

		friendsGlobalList.render();
		friendsLocalList.render();

		//Drag-n-Drop
		let friendsGlobalDragDrop = new DragDrop(friendsGlobalList, friendsLocalList);

		friendsGlobalDragDrop.init();

		//Обработчик добавления друга кликом по кнопке + и удаления кликом по кнопке х
        document.querySelector('.friend-list-wrapper').addEventListener('click', e => {
           if (e.target.closest('.add-friend-button')) {
               const friendItem = e.target.closest('.friend');
               const friendDtata = friendItem.dataset;

			   replaceFriend(friendsGlobalList, friendsLocalList, friendDtata);

           } else if (e.target.closest('.remove-friend-button')) {
               const friendItem = e.target.closest('.friend');
               const friendDtata = friendItem.dataset;

			   replaceFriend(friendsLocalList, friendsGlobalList, friendDtata);
           }
        });

		//Кнопка Сохранить
        const saveButton = document.querySelector('.save-button');

        saveButton.addEventListener('click', () => {
            let dataToSave = JSON.stringify(friendsLocalList.data);

            localStorage.setItem('friendsLocal', dataToSave);
        })
    });

