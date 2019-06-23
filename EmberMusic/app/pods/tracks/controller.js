import Controller from '@ember/controller';

export default Controller.extend({

    queryParams: ['limit', 'page', 'sort', "direction"],

    limit:25,
    page: 1,
    sort: null,
    direction: null,
});