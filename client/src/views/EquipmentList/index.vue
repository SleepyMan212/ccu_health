<script>
import "../../assets/scss/core.scss";
export default {
    name: "EquipmentList",
    data() {
        return {
            tableData: []
        };
    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
        handleEdit(row) {
            console.info(row);
        },
        async handleDelete(row) {
            const { id } = row;
            await this.$http.delete(`//127.0.0.1:3000/equipment/${id}`)
            await this.getData();
        },
        async getData() {
            const { data } = await this.$http.get('//127.0.0.1:3000/equipment')
            this.tableData = data.data
        }
    },
    async created() {
        this.getData();
    }
};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
