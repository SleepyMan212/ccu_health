<script>
import "../../assets/scss/core.scss";
import OrderForm from "../../components/OrderForm/index"
import OrderList from "../../components/OrderList/index"
import dayjs from "dayjs"

export default {
    name: "Order",
    components: {
        OrderForm,
        OrderList
    },
    data() {
        return {
            isCollapse: true,
            tableData: [],
            equipmentOptions:[],
            statusOptions:[],
            currentEquipment: '',
            currentStatus: '',
            useCount: 0,
            count: 0
        };
    },
    methods: {
        switchMenu() {
            this.isCollapse = !this.isCollapse
        },
        async getData() {
            try {
                const res = await this.$http.get('//127.0.0.1:3000/orders')
                this.tableData = res.data.data
                    .sort((a, b) => a.id > b.id)
                    .filter((d) => {
                        if(this.$route.query.id) return this.$route.query.id == d.id
                        return true
                    })
                console.log(this.$route.query.id)
                this.updateCount(this.currentEquipment);
            } catch (error) {
                console.error(error)
            }
        },
        async updateCount(val) {
            const {data} = await this.$http.get(`//127.0.0.1:3000/equipment/${val}`);
            this.useCount = data.useCount;
            this.count = data.count;
        }

    },
    computed: {
        hadleData() {
            return this.tableData.map(data => {
                let statusText = ""
                if(data.status === true) {
                    statusText = '已歸還'                    
                } else {
                    if(dayjs().isAfter(dayjs(data.expiredAt))) {
                        statusText = '已過期'                    
                    } else {
                        statusText = '借用中'                    
                    }
                }

                data.statusText = statusText
                return data
            })
            .filter(data => {
                    if(this.currentStatus !== '') return data.statusText === this.currentStatus;
                    return true;
            })
            .filter(data => {
                    if(this.currentEquipment !== '') return data.equipmentId === this.currentEquipment;
                    return true;
            })
        }
    },
    async created() {
        const {data: { data }} = await this.$http.get(`//127.0.0.1:3000/equipment/`);
        this.equipmentOptions = data.map(item => {
            return {
                key: item.name,
                value: item.id,
                label: item.name
            }
        })
        this.statusOptions = [
            {
                key: '已歸還',
                value: '已歸還'
            },
                        {
                key: '已過期',
                value: '已過期'
            },
                        {
                key: '借用中',
                value: '借用中'
            }
        ]
    },
    watch:{
        async currentEquipment(val){
            this.updateCount(val)
        }
    }

};

</script>
<!-- 引入template.html,style.scss  -->
<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
