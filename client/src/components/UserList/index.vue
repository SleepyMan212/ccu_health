<script>
import "../../assets/scss/core.scss";
import { mapGetters } from 'vuex'

export default {
    name: "EquipmentList",
    props:['getData', 'tableData'],
    data() {
        return {
            // tableData: [],
        };
    },
    components: {
    },computed:{
            ...mapGetters([
            'isLogin',
            'user'
        ]),
    },
    methods: {
        handleClick(row) {
            this.$toasted.show('確認要刪除嗎?', { 
                type:'error',
                duration:3000,
                action: [{
                    text : '確認',
                    onClick : (e, toastObject) => {
                        toastObject.goAway(0);
                        this.handleDelete(row)
                    }
                },{
                    text : '取消',
                    onClick : (e, toastObject) => {
                        toastObject.goAway(0);
                    }
                }
                ]
            });
        },
        async handleDelete(row) {
            const { id } = row;
            await this.$http.delete(`/users/${id}`)
            await this.getData();
            this.$toasted.show('刪除成功', {type:'success', duration:3000})
        },
        async handleEdit(row) {
            this.$root.$emit('UserEdit', row);
        },
    },
    async created() {
        if(this.isLogin) {
            this.getData();
        }
    },
    watch: {
        isLogin(val) {
            if(val === true) {
                this.getData();
            } else {
                this.tableData = [];
            }
        }
    }
};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
