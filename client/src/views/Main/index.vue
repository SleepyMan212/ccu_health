<script>
import "../../assets/scss/core.scss";
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "app",
    data() {
        return {
            isCollapse: true,
            dialogFormVisible: false,
            form: {
                username: '',
                password: '',
            },
            formLabelWidth: '120px',
        };
    },
    methods: {
        ...mapActions([
            'setToken',
            'checkLogin',
        ]),
        switchMenu() {
            this.isCollapse = !this.isCollapse
        },
        async login() {
            const { data: { data: { token } } } = await this.$http.post(`//127.0.0.1:3000/users/login`, this.form)
            if (token !== null) {
                await this.setToken(token);
                console.info('login success')
                await this.checkLogin()
            } else {
                console.info('login fail')
            }

            this.dialogFormVisible = false;
        },
        async logout() {
            await this.setToken(null);
            console.info(this.isLogin)
        },
    },
    async created() {
        await this.checkLogin()
    },
    computed: {
        ...mapGetters([
            'user',
            'isLogin'
        ]),
    }

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
