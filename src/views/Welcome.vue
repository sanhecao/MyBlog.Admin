<template>
<div>
    ddddd
</div>
</template>

<script>
    export default {
        name: "Welcome",
        mounted() {
            var curTime = new Date();
            if(window.localStorage.TokenExpire){
                var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))
                if(curTime>=expiretime){
                    this.$router.push('/login');
                }
            }else {
                this.$router.push('/login');
            }

        },
    }
</script>

<style scoped>

</style>
