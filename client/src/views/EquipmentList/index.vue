<script>
import "../../assets/scss/core.scss";
import { mapGetters } from 'vuex'

export default {
    name: "EquipmentList",
    data() {
        return {
            tableData: [],
            equipmentFormVisible: false,
            formLabelWidth: '120px',
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
            ...mapGetters([
            'isLogin'
        ]),
    },
    methods: {
        handleClick(row) {
            console.log(row);
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
        handleEdit(row) {
            this.equipmentFormVisible = true
            this.$set(this, 'form', row);
        },
        async handleDelete(row) {
            const { id } = row;
            await this.$http.delete(`//127.0.0.1:3000/equipment/${id}`)
            await this.getData();
            this.$toasted.show('刪除成功', {type:'success', duration:3000})
        },
        async getData() {
            try {
                const res = await this.$http.get('//127.0.0.1:3000/equipment')
                this.tableData = res.data.data.sort((a, b) => a.id > b.id)   
            } catch (error) {
                console.error(error)
            }
        },
        async updateEquipment(id) {
            await this.$http.put(`//127.0.0.1:3000/equipment/${id}`, this.form);
            await this.getData();
            this.equipmentFormVisible = false
        }
    },
    async created() {
        this.getData();
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
