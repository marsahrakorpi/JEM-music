import Component from '@ember/component';

export default Component.extend({
    showModal: false,

    actions:{
        showModal(){
            console.log("showModal");
            console.log(this.get('showModal'));
            this.set('showModal', true)
        },
        hideModal(){
            console.log("closeModal");
            console.log(this.get('closeModal'));
            this.set('showModal', false)
        }

    }
});
