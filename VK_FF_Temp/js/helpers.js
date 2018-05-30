//Функция фильтрации строк
function isMatching(full, chunk) {
	return (full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0);
}

//Сортировка по имени друга
function sortFriends (friendA, friendB) {
	if (friendA.first_name > friendB.first_name) {
		return 1;
	}  else {
		return -1;
	}
}

//Перенос данных о друге из одного списка в другой
function replaceFriend (sourceList, targetList, friend) {
	sourceList.data = sourceList.data.filter(item => {
		if (item.id != friend.id) {
			return item;
		}
	});

	targetList.data.push(friend);

	sourceList.updateData(sourceList.data.sort(sortFriends));
	targetList.updateData(targetList.data.sort(sortFriends));

}

export {
	isMatching,
	sortFriends,
	replaceFriend
}