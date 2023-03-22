<script>
import "../../assets/scss/core.scss";
import { mapActions, mapGetters } from 'vuex'

export default {
    name: "OrderRecord",
    components: {},
    data() {
        return {
            tableData: [],
        };
    },
    methods: {
        ...mapActions([
            'checkLogin',
        ]),
        async getData() {
            try {
                const res = await this.$http.get('//127.0.0.1:3000/orders/record')
                this.tableData = res.data.data.map(d=>{
                    return {
                        ...d,
                        statusText: this.mapStatusText(d.status)
                    }
                });
            } catch (error) {
                console.error(error)
            }
        },
        mapStatusText(id) {
            switch(id) {
                case 0: return '借出';
                case 1: return '歸還';
                case 2: return '續借';
                case 3: return '刪除';
                case 4: return '更新';
            }
        }
    },
    computed: {
        ...mapGetters([
            'user',
            'isLogin',
        ]),
    },
    async created() {
        await this.checkLogin()
        if(this.isLogin&&this.user.isAdmin){
            this.getData()
        } else {
            this.$router.push('/')
        }
    },
    watch:{}

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
