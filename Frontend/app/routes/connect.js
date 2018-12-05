import Route from '@ember/routing/route';
import $ from 'jquery'
import ENV from '../config/environment';

export default Route.extend({

    init(){
        this._super(...arguments);
    },

    model(){
             
        return $.ajax({
            url: ENV.APP.jemapiURL+"/DatabaseQuery/testconnection",
            type: "GET",
            crossDomain: true,
            headers: {
            'Access-Control-Allow-Origin': '*'
            }
        }).done(function (data) {
            console.log(data);
        });
    }
});
