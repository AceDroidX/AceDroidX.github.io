const first = {
    template: `
<div>
<div>
<transition-group name="fade">
    <p v-if="this.$route.query.show" key=1 style="font-family:STXINGKA;font-size: 50;">杭七中学生会</p>
    <p v-if="this.$route.query.show" key=2 style="font-family:STXINGKA;font-size: 50;">招新</p>
    <img alt="" key=3 src="icon.png" class="max-75">
    <p v-if="this.$route.query.show" key=4 style="font-family:STXINGKA;font-size: 50;">点此进入</p>
</transition-group>
</div>
<div style="height: 50%"></div>
<div class="imgfs"></div>
</div>
`//, computed: {
    //                 show: function () {
    //                     return this.$route.query.show
    //                 }
    //             }
}
const introduce = {
    template: `
<div>
    <div>
        <transition-group name="fade">
            <p v-if="this.$route.query.show" key=1 style="font-family:STXINGKA;font-size: 50;">杭七中学生会</p>
            <p v-if="this.$route.query.show" key=2 style="font-family:STXINGKA;font-size: 50;">招新</p>
            <img alt="" key=3 src="icon.png" class="max-75">
            <p v-if="this.$route.query.show" key=4 style="font-family:STXINGKA;font-size: 50;">点此进入</p>
        </transition-group>
    </div>
    <div style="height: 50%"></div>
    <div class="imgfs"></div>
</div>
` }
const router = new VueRouter({
    routes: [
        { path: '/first', component: first },
        { path: '/introduce', component: introduce }
    ]
})