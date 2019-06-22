"use strict";

class QueryBuilder {

    constructor(query) {
        if(!query) throw new error("No query given to QueryBuilder");

        query.limit ? this.limit = query.limit : this.limit=25;
        if (query.page) this.page = query.page;
        if (query.order) this.order = order;

    }

    buildQuery(){

    }

}


module.exports = QueryBuilder;