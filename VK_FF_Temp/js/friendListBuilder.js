class FriendListBuilder {
    constructor(data, options) {
        this.data = data;
        this.templateEl = options.templateEl;
        this.containerEl = options.containerEl;
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
    };


}

export default FriendListBuilder;