<script>
import "../../assets/scss/core.scss";

export default {
    name: "OrderForm",
    props: ['getData','options'],
    data() {
        return {
            orderFormVisible: false,
            formLabelWidth: '120px',
            type:'create',
            title: '新增器材',
            // options:[],
            form: {
                userName: '',
                phone: '',
                department: '',
                count: 0,
                equipmentId: null,
                email: '',
                comment: '',
                eqipmentNumberComment: ''
            },
            defaultForm: {
                userName: '',
                department: '',
                phone: '',
                count: 0,
                equipmentId: null,
                email: '',
                comment: '',
                eqipmentNumberComment: ''
            },
            rules:{
                email: [
                    { type:'email', required: true, message: '請輸入正確的 email', trigger: 'blur' },
                ],
                phone: [
                    { required: true, message: '請輸入正確的電話', trigger: 'blur' },
                ],
                userName: [
                    {required: true, message: '請輸入借用人', trigger: 'blur'}
                ],
                department: [
                    {required: true, message: '請輸入單位／系所', trigger: 'blur'}
                ],
                eqipmentNumberComment: [
                    {required: true, message: '請輸入器材或財產編號', trigger: 'blur'}
                ],
                count: [
                    {required: true, message: '請輸入借用數量', trigger: 'blur'}
                ],
                equipmentId: [
                    {required: true, message: '請輸入借用器材', trigger: 'blur'}
                ]

            }
        };
    },
    computed:{
    },
    methods: {
        handleEdit(row) {
            this.orderFormVisible = true
            this.form = JSON.parse(JSON.stringify(row));
            this.type = 'update'
            this.title = "更新租借";
        },
        async handleForm(id) {
            this.$refs.orderForm.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    if(this.type === 'create'){
                        res = await this.$http.post(`//127.0.0.1:3000/orders/`, this.form);
                    } else if(this.type === 'update') {
                        res = await this.$http.put(`//127.0.0.1:3000/orders/${id}`, this.form);
                    }
                    if(res.data.msg) {
                        this.$toasted.show(res.data.msg, {type:'error', duration:3000})
                    } else {
                        this.$toasted.show('操作成功', {type:'success', duration:3000})
                        await this.getData();
                        this.orderFormVisible = false
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async handleAdd() {
            this.orderFormVisible = true
            this.form = this.defaultForm;
            this.type = 'create';
            this.title = "新增租借";
        }
    },
    watch: {
    },
    async mounted(){
        this.$root.$on('equipmentEdit', data => {
            this.handleEdit(data)
        })
    },
};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
