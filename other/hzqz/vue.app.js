var app = new Vue({
    el: '#app',
    router,
    data: {
        drawer: null,
        items: [
            { id: 0, title: 'Home', icon: 'dashboard', link: "https://AceDroidX.github.io/?f=gp" },
            { id: 1, title: 'About', icon: 'question_answer', link: "https://AceDroidX.github.io/about?f=gp" },
            { id: 2, title: 'filebrowser', icon: 'folder', link: "./filebrowser" },
            { id: 3, title: 'download', icon: 'folder', link: "./download" },
            { id: 4, title: 'aria2', icon: 'folder', link: "https://aria.acedroidx.top" },
            { id: 5, title: 'webdav', icon: 'folder', link: "./webdav" }
        ],
        function() {
            return {
                show: false
            }
        },
    },

    mounted: function () {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            hash = window.location.hash
            if (hash == "#/") {
                this.$router.push('/first');
            }
            hash = window.location.hash
            if (hash == "#/first") {
                setTimeout(function () { this.$router.push('/first?show=true') }.bind(this), 2000);
            }
        })
    },
    methods: {
        itemclick: function (id) {
            window.open(this.items[id].link)
        },
        routechange: function () {
            // if (this.$route.fullPath == "/first") {
            //     console.log('set time')
            //     // setTimeout(function () { this.$router.push('/main') }.bind(this), 2000);
            // }
        }
    },
    watch: {
        '$route': 'routechange'
    },
})