class FriendsManager {
    constructor (globalData, localData) {
        this.globalData = globalData.sort(sortFriends);
        this.localData = localData.sort(sortFriends);
    }

    addToLocal (friend) {
        let self = this;
        let newData = replaceFriend(self.globalData, self.localData, friend);

        self.globalData = newData.source.sort(sortFriends);
        self.localData = newData.target.sort(sortFriends);

    }

    removeFromLocal (friend) {
        let self = this;
        let newData = replaceFriend(self.localData, self.globalData, friend);

        self.globalData = newData.target.sort(sortFriends);
        self.localData = newData.source.sort(sortFriends);
    }

}

function sortFriends (friendA, friendB) {
    if (friendA.first_name > friendB.first_name) {
        return 1;
    }  else {
        return -1;
    }
}

function replaceFriend (source, target, friend) {
    source = source.filter(item => {
        if (item.id != friend.id) {
            return item;
        }
    });

    target.push(friend);

    return {
        source,
        target
    }
}

export default FriendsManager;