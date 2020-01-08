<template>
    <section>
<!--   查询工具条     \-->
        <Toolbar :button-list="buttonList" @callFunction="callFunction"></Toolbar>
<!--        列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading"
                  @current-change="selectCurrentRow"
                  style="width: 100%">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="name" label="角色名"  sortable></el-table-column>
            <el-table-column prop="description" label="说明"  sortable></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="formatCreateTime"  sortable></el-table-column>
            <el-table-column prop="enabled" label="状态" width="200" sortable>
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enabled?'success':'danger'" disable-transitions >
                        {{scope.row.enabled?"正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>

        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="50"
                    :total="total"
                    style="float:right;"
            ></el-pagination>
        </el-col>
<!--        编辑-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px"
                     :rules="editFormRules" ref="editForm">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-select v-model="editForm.enabled" placeholder="请选择角色状态">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="description">
                    <el-input v-model="editForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
<!--    新增-->
        <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="enabled">
                    <el-select v-model="addForm.enabled" placeholder="请选择角色状态">
                        <el-option label="激活" value="true"></el-option>
                        <el-option label="禁用" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="description">
                    <el-input v-model="addForm.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>

        </el-dialog>

    </section>
</template>

<script>
    import util from '../../../util/date';
    import Toolbar from "../../components/Toolbar";
    import {getButtonList} from "../../promissionRouter";
    import {getRoleListPage,editRole,addRole,removeRole} from "../../api/api";
    export default {
        name: "Roles.vue",
        components:{
            Toolbar
        },
        data(){
            return{
                filters: {
                    name: ""
                },
                buttonList:[],
                users:[],
                listLoading:false,
                page:1,
                total:0,
                sels:[],
                currentRow: null,
                editFormVisible:false,
                editForm:{
                    id: 0,
                    createBy: "",
                    name: "",
                    enabled: false
                },
                editFormRules:{
                   name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
                    enabled: [{ required: true, message: "请选择状态", trigger: "blur" }]
                },
                editLoading:false,
                statusList: [
                    { name: "激活", value: true },
                    { name: "禁用", value: false }
                ],
                addFormVisible:false,
                addForm:{
                    createBy: "",
                    createId: "",
                    name: "",
                    enabled: true
                },
                addFormRules:{
                    Name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
                    Enabled: [{ required: true, message: "请选择状态", trigger: "blur" }]
                },
                addLoading:false,
            }
        },
        methods:{
            selectCurrentRow(val) {
                this.currentRow = val;
            },

            formatEnabled: function(row, column) {
                return row.enabled ? "正常" : "未知";
            },
            formatCreateTime: function(row, column) {
                return !row.createTime || row.createTime === ""
                    ? ""
                    : util.formatDate.format(new Date(row.createTime), "yyyy-MM-dd");
            },
            callFunction(item){

                console.log('父callFunction',item);
                this.filters={
                    name:item.search
                };
                this[item.func].apply(this, item);
                console.log('父callFunction',item);
            },
            //获取角色列表
            getRoles(){
                let _this=this;
                let para={
                    page: this.page,
                    key: this.filters.name
                };
                this.listLoading=true;
                getRoleListPage(para).then(res=>{
                    this.total=res.data.response.dataCount;
                    this.users=res.data.response.data;
                    this.listLoading = false;
                    console.log('getRoles', this.users);

                })


            },
            handleCurrentChange(val){
                this.page=val;
                this.getRoles();
            },
            batchRemove(){
                this.$message({
                    message: "该功能未开放",
                    type: "warning"
                });
            },
            handleEdit(){
                let row = this.currentRow;
                if(!row){
                    this.$message({
                        message:"请选择要编辑的一行数据",
                        type:"error"
                    });
                    return;
                }
                this.editFormVisible =true;
                this.editForm=Object.assign({},row);
            },
            editSubmit(){
                this.$refs.editForm.validate(valid=>{
                    if(valid){
                        this.$confirm("确认提交吗?","提示",{})
                            .then(()=>{
                                this.editLoading=true;
                                let para=Object.assign({},this.editForm);
                                para.birth =
                                    !para.birth || para.birth === ""
                                        ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                                        : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");

                                editRole(para).then(res=>{
                                    if(util.isEmt.format(res)){
                                        this.editLoading=false;
                                        return;
                                    }
                                    if(res.data.success){
                                        this.editLoading=false;
                                        this.$message({
                                            message:res.data.msg,
                                            type:"success"
                                        });
                                        this.$refs["editForm"].resetFields();
                                        this.editFormVisible=false;
                                        this.getRoles();
                                    }else{
                                        this.$message({
                                            message:res.data.msg,
                                            type:"error"
                                        });
                                    }
                                })
                            })
                    }
                })

            },
            addSubmit(){
                let _this=this;
                this.$refs.addForm.validate(valid=>{
                    if(valid){
                        this.$confirm("确认提交吗?","提示",{})
                            .then(()=>{
                                this.addLoading=true;
                                let para=Object.assign({},this.addForm);
                                para.birth =
                                    !para.birth || para.birth === ""
                                        ? util.formatDate.format(new Date(), "yyyy-MM-dd")
                                        : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
                                var user=JSON.parse(window.localStorage.user);
                                if(user&&user.uID>0){
                                    para.createId=user.uID;
                                    para.createBy=user.uRealName;
                                }else{
                                    this.$message({
                                        message:"用户信息为空,先登入",
                                        type:"error"
                                    });
                                    _this.$router.replace(_this.$route.query.redirect?_this.$route.query.redirect:"/");
                                }
                                addRole(para).then(res=>{
                                    if(util.isEmt.format(res)){
                                        this.addLoading=false;
                                        return;
                                    }
                                    if(res.data.success){
                                        this.addLoading=false;
                                        this.$message({
                                            message:res.data.msg,
                                            type:"success"
                                        });
                                        this.$refs["addForm"].resetFields();
                                        this.addFormVisible=false;
                                        this.getRoles();
                                    }else{
                                        this.$message({
                                            message:res.data.msg,
                                            type:"error"
                                        })
                                    }
                                })

                            })
                    }

                })

            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm = {
                    createBy: "",
                    name: "",
                    enabled: ""
                };
            },
            //删除
            handleDel(){
                let row=this.currentRow;
                if(!row){
                    this.$message({
                        message:"请选择要编辑的一行数据",
                        type:"error"
                    });
                    return;
                }
                this.$confirm("确认删除该记录吗","提示",{})
                    .then(()=>{
                        this.loading=true;
                        let para={rid:row.id};
                        removeRole(para).then(res=>{
                            if(util.isEmt.format(res)){
                                this.listLoading =false;
                                return;
                            }
                            this.listLoading=false;
                            if(res.data.success){
                                this.$message({
                                    message:"删除成功",
                                    type:"success"
                                });
                            }else{
                                this.$message({
                                    message:res.data.msg,
                                    type:"error"
                                });
                            }
                            this.getRoles();
                        })
                    }).catch(()=>{})
            }
        },
        mounted() {
            this.getRoles();
            let routers=window.localStorage.router?JSON.parse(window.localStorage.router):[];
            this.buttonList=getButtonList(this.$route.path, routers);
            console.log('rolegetbuttonlist',this.buttonList);
        }
    }
</script>

<style scoped>

</style>
