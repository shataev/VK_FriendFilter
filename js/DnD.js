//Компонент drag-n-drop

import {replaceFriend} from './helpers';

class DragDrop {
	constructor (sourceList, targetList) {
		this.sourceList = sourceList;
		this.targetList = targetList;
		this.sourceZone = sourceList.containerEl;
		this.dropZone = targetList.containerEl;
	}

	init () {

		let zones = [
				{zone: this.sourceZone, sourceList: this.sourceList, targetList: this.targetList},
				{zone: this.dropZone, sourceList: this.targetList, targetList: this.sourceList}
			];
		let currentDrag;

		for (const zone of zones) {
			zone.zone.addEventListener('dragstart', (e) => {
				if (e.target.classList.contains('friend-list-item')) {
					currentDrag = {
						source: zone.zone,
						sourceList: zone.sourceList,
						targetList: zone.targetList,
						data: JSON.stringify(e.target.dataset)
					};
				}
			});

			zone.zone.addEventListener('dragover', (e) => {
				if (e.preventDefault) {
					e.preventDefault();
				}
			});

			zone.zone.addEventListener('drop', (e) => {
				if (currentDrag) {
					if (e.preventDefault) {
						e.preventDefault();
					}

					if (currentDrag.source !== zone.zone) {
						let friendData = JSON.parse(currentDrag.data);

						//Обновляем списки друзей
						replaceFriend(currentDrag.sourceList, currentDrag.targetList, friendData);
					}

					currentDrag = null;
				}
			});
		}
	}
}

export default DragDrop;