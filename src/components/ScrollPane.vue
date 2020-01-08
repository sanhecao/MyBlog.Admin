<template>
    <el-scrollbar ref="scrollContainer" class="scroll-container"
    @wheel.native.prevent="handleScroll"
    :vertical="false"
    >
        <slot />
    </el-scrollbar>
</template>

<script>
    const  tagAndTagSpacing=4;
    export default {
        name: "ScrollPane",
        data(){
            return{
                left:0
            }
        },
        computed:{
            scrollWrapper(){
                return this.$refs.scrollContainer.$refs.wrap
            }
        },
        methods:{
            handleScroll(e){
                const eventDelta=e.wheelDelta || -e.deltaY *40;
                const $scrollWrapper=this.scrollWrapper;
                $scrollWrapper.scrollLeft=$scrollWrapper.scrollLeft + eventDelta/4;
            },
            moveToTarget(currentTag, tagList){
                const $container= this.$refs.scrollContainer.$el;
                const $containerWidth=$container.offsetWidth;
                const $scrollWrapper=this.scrollWrapper;
                let firstTag=null;
                let lastTag=null;
                if(tagList.length > 0){
                    firstTag=tagList[0];
                    lastTag=tagList[tagList.length-1];
                    if(firstTag === currentTag){
                        $scrollWrapper.scrollLeft =0
                    }else if (lastTag === currentTag){
                        $scrollWrapper.scrollLeft=$scrollWrapper.scrollWidth-$containerWidth
                    }else{
                        const currentIndex=tagList.findIndex(item=>item ===currentTag);
                        const prevTag =tagList[currentIndex -1];
                        const nextTag = tagList[currentIndex +1];
                        const afterNextTagOffsetLeft =nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;
                        const beforePrevTagOffsetLeft =prevTag.$el.offsetLeft -tagAndTagSpacing;
                        if(afterNextTagOffsetLeft > $scrollWrapper.scrollLeft +$containerWidth){
                            $scrollWrapper.scrollLeft=afterNextTagOffsetLeft-$containerWidth
                        }else if(beforePrevTagOffsetLeft<$scrollWrapper.scrollLeft){
                            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
                        }
                    }
                }
            }
        }
    }
</script>

<style >
    .scroll-container {
        white-space: nowrap;
        position: relative !important;
        overflow: hidden !important;
        width: 100%;
    }
    .scroll-container  .el-scrollbar__bar {
        bottom: 0px;
    }
    .scroll-container  .el-scrollbar__wrap {
        height: 49px;
    }
</style>
