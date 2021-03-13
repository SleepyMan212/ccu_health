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
            isLogin: false,
        };
    },
    methods: {
        ...mapActions([
            'setToken',
            'setUser',
            'getUser',
            'checkLogin'
        ]),
        ...mapGetters([
            'user'
        ]),
        switchMenu() {
            this.isCollapse = !this.isCollapse
        },
        async login() {
            const { data: { data: { token } } } = await this.$http.post(`//127.0.0.1:3000/users/login`, this.form)
            if (token !== null) {
                await this.setToken(token);
                console.info('login success')
            } else {
                console.info('login fail')
            }

            this.dialogFormVisible = false;
            this.isLogin = await this.checkLogin();
        },
        async logout() {
            await this.setToken(null);
            this.isLogin = await this.checkLogin();
        }
    },
    async created() {
        const { data } = await this.$http.get(`//127.0.0.1:3000/users/login`)
        this.isLogin = data.status;
        this.setUser(data.user)
    },
    computed: {
    }

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
