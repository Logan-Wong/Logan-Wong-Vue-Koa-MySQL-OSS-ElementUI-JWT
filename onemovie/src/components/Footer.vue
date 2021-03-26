<template>
    <div class="footer">
        <div class="content">
            <div class="line-one">
                <div class="copyright">
                    <span>版权所有 2017-2021</span>
                </div>
                <div class="contact">
                    <span>联系我们：Logan_Wong@163.com</span>
                </div>
            </div>
            <div class="icp">
                <span>粤ICP备2017030101013号</span>
                <span>|</span>
                <span>ICP证：粤2017030101013</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.footer {
    position: relative;
    width: 100%;
    height: 100px;
    background-color: #666;
    color: #c1c1c1;
    font-size: 15px;
    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 470px;
        height: 80px;
        // border: 1px red solid;
        box-sizing: border-box;
        .line-one {
            margin-top: 15px;
            .copyright {
                float: left;
            }
            .contact {
                float: left;
                margin-left: 80px;
            }
        }
        .icp {
            margin-top: 48px;
            span:nth-child(2) {
                margin: 0 20px;
            }
        }
    }
}
</style>
