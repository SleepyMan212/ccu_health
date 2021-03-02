<script>
import "../../assets/scss/core.scss";
export default {
    name: "Equipment",
    data() {
        return {
            isCollapse: true
        };
    },
    methods: {
        switchMenu() {
            this.isCollapse = !this.isCollapse
        }
    }

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
