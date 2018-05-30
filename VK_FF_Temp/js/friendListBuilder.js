import Filter from './friendFilter';

class FriendListBuilder {
    constructor(data, templateEl, containerEl, filterOptions) {
        this.data = data;
        this.templateEl = templateEl;
        this.containerEl = containerEl;
        this.filter = new Filter({
		    el: filterOptions.el,
		    data: this.data,
		    fields: filterOptions.fields,
		    targetEl: this.containerEl,
		    template: this.templateEl,
        });

        this.filter.init();
    };

    render() {
        if (!this.data) {
            return;
        }

        const template = this.templateEl;
        const render = Handlebars.compile(template);
        const html = render({items: this.data});
        const results = this.containerEl;

        results.innerHTML = html;
    };

    updateData(newData) {
        this.data = newData;
        this.render();
        this.filter.update(this.data);
        this.filter.filter();
    };
}

export default FriendListBuilder;