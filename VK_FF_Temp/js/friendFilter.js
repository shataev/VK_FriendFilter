import {isMatching} from './helpers';

class FilterValues {
    constructor(options) {
        this.el = options.el;
        this.data = options.data;
        this.fields = options.fields;
        this.targetEl = options.targetEl;
        this.template = options.template;
    };

    init() {
        this.el.addEventListener('keyup', e => {
            this.filter();
        });
    };

    filter () {
		this.targetEl.innerHTML = null;

		let filterValue = this.el.value;
		let filteredValues;

		if (!filterValue) {
			filteredValues = this.data;
		} else {
			filteredValues = this.data.filter(dataItem => {
				let isFiltered = false;

				for (const field of this.fields) {
					isFiltered = isMatching(dataItem[field], filterValue) || isFiltered;
				}

				return isFiltered;
			});
		}

		const render = Handlebars.compile(this.template);
		const html = render({items: filteredValues});

		this.targetEl.innerHTML = html;
    }

    update(newData) {
        this.data = newData;
    }
}

export default FilterValues;