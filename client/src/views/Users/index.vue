
<script>
import "@/assets/scss/core.scss";
import UserList from "../../components/UserList/index"
import UserForm from "../../components/UserForm/index"
import { mapGetters } from 'vuex'

export default {
    name: "Users",
    components: {
        UserForm,
        UserList
    }, 
    data() {
        return {
            tableData: [],
            authOptions:[
                {
                    value:2,
                    label: "管理者"
                }
            ]
        };
    }
    ,computed:{
            ...mapGetters([
            'user',
        ]),
    },
    created() {
        if(!this.user || !this.user.isAdmin) {
            this.$router.push('/')
        }
    },
    methods: {
        async getData() {
            try {
                const res = await this.$http.get('//127.0.0.1:3000/users')
                this.tableData = res.data.map(d=>{
                    return {
                        ...d,
                        authText: d.auth === 2 ? "管理者" : "一般人",
                        createdAt: d.createdAt.substring(0,10)
                    }
                })
            } catch (error) {
                console.error(error)
            }
        },
    }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
