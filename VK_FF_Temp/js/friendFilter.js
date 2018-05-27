class FilterValues {
    constructor(el, options) {
        this.el = el;
        this.data = options.data;
        this.fields = options.fields;
        this.targetEl = options.targetEl;
        this.template = options.template;
    };

    init() {
        this.el.addEventListener('keyup', e => {
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
        });
    };

    updateData(newData) {
        this.data = newData;
    }
}

//Функция фильтрации строк
function isMatching(full, chunk) {
    return (full.toUpperCase().indexOf(chunk.toUpperCase()) >= 0);
}

export default FilterValues;