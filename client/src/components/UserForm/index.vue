<script>
import "../../assets/scss/core.scss";

export default {
    name: "UserForm",
    props: ['getData','options'],
    data() {
        return {
            userFormVisible: false,
            formLabelWidth: '120px',
            type:'create',
            title: '新增使用者',
            form: {
                username: '',
                auth: null,
                password: "",
                passwordAgain: ""
            },
            defaultForm: {
                username: '',
                auth: null,
                password: "",
                passwordAgain: ""
            },
            rules:{
                userName: [
                    {required: true, message: '請輸入借用人', trigger: 'blur'}
                ],
                auth: [
                    {required: true, message: '請選擇權限', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '請輸入密碼', trigger: 'blur'}
                ],
                passwordAgain: [
                    {required: true, message: '請輸入密碼驗證', trigger: 'blur'}
                ]
            },
            oldPassword: [
                {required: true, message: '請輸入舊密碼', trigger: 'blur'}
            ],
        };
    },
    computed:{
    },
    methods: {
        handleEdit(row) {
            this.userFormVisible = true
            this.form = JSON.parse(JSON.stringify(row));
            this.type = 'update'
            this.title = "更新使用者";
            this.rules["oldPassword"] = this.oldPassword
        },
        async handleForm(id) {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    let res = null;
                    if(this.form.password !== this.form.passwordAgain){
                        this.$toasted.error('密碼不一致', {type:'success', duration:3000})
                    }else {
                        if(this.type === 'create'){
                            res = await this.$http.post(`/users/register`, this.form);
                        } else if(this.type === 'update') {
                            res = await this.$http.put(`/users/${id}`, this.form);
                        }
                        if(res.data.msg) {
                            this.$toasted.show(res.data.msg, {type:'error', duration:3000})
                        } else {
                            this.$toasted.show('操作成功', {type:'success', duration:3000})
                            await this.getData();
                            this.userFormVisible = false
                        }
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async handleAdd() {
            this.userFormVisible = true
            this.form = this.defaultForm;
            this.type = 'create';
            this.title = "新增使用者";
            this.rules.oldPassword && delete this.rules.oldPassword
        }
    },
    watch: {
    },
    async mounted(){
        this.$root.$on('UserEdit', data => {
            this.handleEdit(data)
        })
    },
};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
