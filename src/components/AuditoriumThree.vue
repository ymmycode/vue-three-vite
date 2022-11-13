<template>
    <div class="overflow-hidden">
        <video src="/assets/dualsquare.mp4"
            autoplay
            playsinline
            webkit-playinline
            loop
            preload="auto"
            class="hidden"
            ref="vid"
        ></video>
        <!-- <div class="css h-full w-full absolute top-0 border-white z-20" ref="css"></div> -->
        <div class="webgl h-full w-full absolute" ref="canvas"></div>
        <!-- <div class="webgl h-full w-full absolute pointer-events-none" ref="canvas"></div> -->
        <!-- <transition>
            <div class="h-full w-full fixed z-10">
                <div class="bg-slate-600/50 h-full w-full"></div>
                <video src="https://www.youtube.com/watch?v=z5XdX_ryHoc"
                    autoplay
                ></video>
            </div>
        </transition> -->
    </div>
</template>

<script>
import Experience from '../ThreeScene/Experience.js';

export default{
    name: 'AuditoriumThree',
    data() {
        return {
            canvas: null,
            experience: null,
        }
    },
    mounted() {
        this.initThree()
    },
    methods: {
        initThree () {
            this.canvas = this.$refs.canvas
            this.css = this.$refs.css
            this.experience = new Experience({
                targetElement: this.canvas,
                cssEl: this.css,
                videoEl:  this.$refs.vid
            })
        }
    },
    beforeUnmount() {
        this.experience.destroy()
    }

}

</script>

<style lang="scss" scoped>

</style>