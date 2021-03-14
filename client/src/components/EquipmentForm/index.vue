<script>
import "../../assets/scss/core.scss";

export default {
    name: "EquipmentForm",
    props: ['getData',],
    data() {
        return {
            equipmentFormVisible: false,
            formLabelWidth: '120px',
            type:'create',
            title: '新增器材',
            form: {
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                card: '',
                comment: '',
                count: 0,
                duration: 7,
                name: ''
            },
            defaultForm: {
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
                card: '',
                comment: '',
                count: 0,
                duration: 7,
                name: ''
            }
        };
    },
    computed:{
    },
    methods: {
        handleEdit(row) {
            this.equipmentFormVisible = true
            this.$set(this, 'form', row);
            this.type = 'update'
            this.title = "更新器材";
        },
        async handleForm(id) {
            if(this.type === 'create'){
                await this.$http.post(`//127.0.0.1:3000/equipment/`, this.form);
            } else if(this.type === 'update') {
                await this.$http.put(`//127.0.0.1:3000/equipment/${id}`, this.form);
            }
            await this.getData();
            this.equipmentFormVisible = false
        },
        async handleAdd() {
            this.equipmentFormVisible = true
            this.form = this.defaultForm;
            this.type = 'create';
            this.title = "新增器材";
        }
    },
    watch: {
    },
    mounted(){
        this.$root.$on('equipmentEdit', data => {
            this.handleEdit(data)
        })
    }
};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
