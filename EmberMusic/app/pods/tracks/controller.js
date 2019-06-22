import Controller from '@ember/controller';

export default Controller.extend({

    queryParams: ['limit', 'page'],

    limit:25,
    page: 1,
});