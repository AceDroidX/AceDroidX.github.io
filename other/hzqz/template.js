const first = {
    template: `
    <div>
    <div>
        <transition-group name="fade" mode="out-in" style="display: flex;">
            <p v-if="this.$route.query.show" key=1 style="font-family:STXINGKA;font-size: 50;">杭七中学生会</p>
            <p v-if="this.$route.query.show" key=2 style="font-family:STXINGKA;font-size: 50;">招新</p>
            <img alt="" key=3 src="icon.png" class="max-75">
            <p v-if="this.$route.query.show" @click="next()" key=4 style="font-family:STXINGKA;font-size: 50;">点此进入</p>
        </transition-group>
    </div>
    <div style="height: 50%"></div>
    <div class="imgfs"></div>
</div>
`, methods: {
        next: function () {
            this.$router.push('/introduce')
        }
    }
}
const introduce = {
    template: `
    <div>
    <div>
        <transition-group name="fade" mode="out-in" style="background-color: rgba(255,255,255,0.75);padding: 35px;">
            <p key=1 style="font-family:KAITI;font-size: 30;font-weight:bold;">学生会是什么？</p>
            <p key=2 style="font-family:SONGTI;font-size: 30;">是在校团委指导下全心全意为同学服务的学生组织，是学校联系广大学生的桥梁和纽带。</p>
            <p key=3 style="font-family:KAITI;font-size: 30;font-weight:bold;">学生会做什么？</p>
            <p key=4 style="font-family:SONGTI;font-size: 30;">活动策划、校际联谊、志愿服务、管理社团、卫生检查等等，方方面面贯穿整个高中生活，足迹遍布校园各个角落，以解决同学困难为己任，以建设美好校园为目标。</p>
            <p key=5 style="font-family:KAITI;font-size: 30;font-weight:bold;">加入学生会有什么要求？</p>
            <p key=6 style="font-family:SONGTI;font-size: 30;">态度为首，能力次之。有一颗愿奉献的心，有一个努力进取的态度。</p>
            <p key=7 style="font-family:KAITI;font-size: 30;font-weight:bold;">加入学生会有什么好处？</p>
            <p key=8 style="font-family:SONGTI;font-size: 30;">高中学生会充满挑战，加入学生会可以充分锻炼自身各项能力，为步入大学乃至社会打下基础，在学生会拥有一番成绩也能带来莫大的成就感，同时对于工作认真积极奉献的学生会成员，在校评优评先方面优先考虑。</p>
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