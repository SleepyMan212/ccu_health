<script>
import "../../assets/scss/core.scss";
import EquipmentForm from "../../components/EquipmentForm/index"
import EquipmentList from "../../components/EquipmentList/index"
import { mapGetters } from 'vuex'

export default {
    name: "Equipment",
    components: {
        EquipmentForm,
        EquipmentList
    }
    ,computed:{
            ...mapGetters([
            'user',
        ]),
    },
    data() {
        return {
            isCollapse: true,
            tableData: []
        };
    },
    created() {
        if(!this.user || !this.user.isManager) {
            this.$router.push('/')
        }
    },
    methods: {
        switchMenu() {
            this.isCollapse = !this.isCollapse
        },
        async getData() {
            try {
                const res = await this.$http.get('//127.0.0.1:3000/equipment')
                this.tableData = res.data.data.sort((a, b) => a.id > b.id)   
            } catch (error) {
                console.error(error)
            }
        },
    }

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
