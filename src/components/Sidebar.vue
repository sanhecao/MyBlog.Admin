<template>
<div>
    <template v-if="item.children">
        <el-submenu v-if="!(item.path!=='' && item.path!==' ' && item.path !=='-') && !item.IsButton"
                    :index="item.id + 'index'"
                    :key="item.path">
            <template slot="title">
                <i v-if="item.children&&item.children.length>0&&item.iconCls&&!item.IsButton"
                   class="fa"
                   :class="item.iconCls"></i>
                <span class="title-name" slot="title">{{item.name}}</span>
            </template>
            <template v-for="child in item.children">
                <template v-if="!child.IsHide&&!item.IsButton">
                    <!-- 这里实现自己递归嵌套 -->
                    <sidebar v-if="child.children&&child.children.length>0"
                             :item="child"
                             :index="child.id"
                             :key="child.path"/>
                    <el-menu-item v-else :key="child.path" :index="child.path" @click="cop">
                        <i class="fa" :class="child.iconCls"></i>
                        <template slot="title">
                            <span class="title-name" slot="title">{{child.name}}</span>
                        </template>
                    </el-menu-item>
                </template>

            </template>
        </el-submenu>
        <template v-else>
            <el-menu-item v-if="!item.IsButton" :index="item.path" :key="item.path + 'd'">
                <i class="fa" :class="item.iconCls"></i>
                <template slot="title">
                    <span class="title-name" slot="title">{{item.name}}</span>
                </template>
            </el-menu-item>
        </template>
    </template>
    <template v-else>
        <el-menu-item :index="item.path" :key="item.path +'d'" @click="cop">
            <i class="fa" :class="item.iconCls"></i>
            <template slot="title">
                <span class="title-name" slot="title">{{item.name}}</span>
            </template>
        </el-menu-item>
    </template>
</div>
</template>

<script>
    export default {
        name: "Sidebar",
        props:{
            item:{
                type:Object,
                required: true
            }
        },
        methods:{
            cop:function (){
                this.$emit("collaFa","123");
            }
        }
    }
</script>

<style >

</style>
