<template>
<section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
<!--        @submit.native.prevent 阻止默认提交,-->
        <el-form :inline="true" :model="filters" @submit.native.prevent>
            <el-form-item >
                <el-input v-model="filters.name" placeholder="昵称/登录名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getUsers">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading"
              @selection-change="selsChange"
              style="width: 100%">
        <el-table-column type="selection" width="50">

        </el-table-column>
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="uRealName" label="昵称" width="" sortable></el-table-column>
        <el-table-column prop="uLoginName" label="登录名" width="" sortable></el-table-column>
        <el-table-column prop="roleNames" label="角色" width="" sortable>
            <template slot-scope="scope">
                <el-tag v-for="item in scope.row.roleNames" :key="item.Id">{{item}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="" :formatter="formatSet" sortable></el-table-column>
        <el-table-column prop="birth" label="生日" :formatter="formatBirth" width="" sortable></el-table-column>
        <el-table-column prop="uStatus" label="状态" width="" sortable>
            <template slot-scope="scope">
                <el-tag :type="scope.row.uStatus === 0?'success':'danger'"
                  disable-transitions>{{scope.row.uStatus === 0?"正常":"禁用"}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
            <template scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
<!--    工具条-->
    <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchRemove" :disabled="this.sels.length === 0">批量删除</el-button>
        <el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="50"
                       :total="total" style="float: right">

        </el-pagination>
    </el-col>
    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addForm" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
            <el-form-item label="昵称" prop="uRealName">
                <el-input v-model="addForm.uRealName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="uLoginName">
                <el-input v-model="addForm.uLoginName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="uLoginPWD">
                <el-input v-model="addForm.uLoginPWD" show-password auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别" >
                <el-radio-group v-model="addForm.sex">
                    <el-radio class="radio" :label="1">男</el-radio>
                    <el-radio class="radio" :label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" >
                <el-input-number v-model="addForm.age" :min="0" :max="200" ></el-input-number>
            </el-form-item>
            <el-form-item label="生日" prop="birth">
                <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
            </el-form-item>
            <el-form-item label="地址" >
                <el-input type="textarea" v-model="addForm.addr" ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible=false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" v-model ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
            <el-form-item label="昵称" prop="uRealName">
                <el-input v-model="editForm.uRealName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="uLoginName">
                <el-input v-model="editForm.uLoginName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="RIDs">
                <el-select  multiple  v-model="editForm.RIDs" placeholder="请选择角色">
                    <el-option key="0" label="未选择角色" value="0"></el-option>
                    <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别" >
                <el-radio-group v-model="editForm.sex">
                    <el-radio class="radio" :label="1">男</el-radio>
                    <el-radio class="radio" :label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" >
                <el-input-number v-model="editForm.age" :min="0" :max="200" ></el-input-number>
            </el-form-item>
            <el-form-item label="生日" prop="birth">
                <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
            </el-form-item>
            <el-form-item label="地址" >
                <el-input type="textarea" v-model="editForm.addr" ></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>
</section>
</template>

<script>
    import utils from '../../../util/date';
    import {getUserListPage,addUser,getRoleListPage,editUser,removeUser,batchRemoveUser} from '../../api/api';

    export default {
        name: "Users",

        data(){
            return{
                filters: {
                    name: ''
                },
                listLoading:false,
                total:0,
                page:1,
                users:[],
                roles: [],
                sels: [],//列表选中列
                addFormVisible: false,//新增界面是否显示
                addFormRules:{
                    uLoginName:[
                        {required:true,message:'请输入登录名',trigger:'blur'}
                    ],
                    uRealName:[{
                        required:true, message:'请输入昵称',trigger:'blur'
                    }],
                    birth:[{
                        required:true,message:'请填写生日',trigger:'blur'
                    }],
                    uLoginPWD:[{
                        required:true,message:'请输入密码',trigger:'blur'
                    }]
                },
                addLoading:false,
                //新增界面数据
                addForm: {
                    name: '',
                    uLoginName: '',
                    uRealName: '',
                    uLoginPWD: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                editFormVisible:false,
                //编辑界面数据
                editForm: {
                    id: 0,
                    uID: 0,
                    RIDs: 0,
                    uLoginName: '',
                    uRealName: '',
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                editFormRules:{
                    uLoginName: [
                        {required: true, message: '请输入登录名', trigger: 'blur'}
                    ],
                    uRealName: [
                        {required: true, message: '请输入昵称', trigger: 'blur'}
                    ],
                    birth: [
                        {required: true, message: '请填写生日', trigger: 'blur'}
                    ]
                },
                editLoading:false,
            }
        },
        methods:{
            formatSet(row,column){
                return row.sex ===1?'男':row.sex===0?'女':'未知';
            },
            formatBirth(row,column){
                return (!row.birth || row.birth === '')?'':utils.formatDate.format(new Date(row.birth),'yyyy-MM-dd');
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val){
                this.page=val;
                this.getUsers();
            },
            //新增
            handleAdd(){
                this.addFormVisible=true;
                this.addForm={
                    uLoginName: '',
                    uRealName: '',
                    uLoginPWD: '',
                    name:'',
                    sex: -1,
                    age:0,
                    birth: '',
                    addr: ''
                }
            },
            addSubmit(){
                this.$refs.addForm.validate(vaild=>{
                    if(vaild){
                        this.$confirm('确认提交吗?','提示',{}).then(()=>{
                          this.addLoading=true;
                          let para=Object.assign({},this.addForm);
                          para.birth=(!para.birth|| para.birth==='')?
                              utils.formatDate.format(new Date(),'yyyy-MM-dd'):
                              utils.formatDate.format(new Date(para.birth),'yyyy-MM-dd');
                          addUser(para).then(res=>{
                              if(utils.isEmt.format(res)){
                                  this.addLoading=false;
                                  return;
                              }
                              if (res.data.success){
                                  this.addLoading=false;
                                  this.$message({
                                      message:res.data.msg,
                                      type:"success"
                                  });
                                  this.$refs['addForm'].resetFields();
                                  this.addFormVisible=false;
                                  this.getUsers();
                              }else {
                                  this.$message({
                                      message:res.data.msg,
                                      type:'error'
                                  });
                              }
                          })
                        })
                    }
                })
            },
            //编辑
            handleEdit(index, row){
                this.editFormVisible=true;
                console.log('handleEdit',row);
                this.editForm=Object.assign({},row);
                getRoleListPage().then(res=>{

                    this.roles=res.data.response.data;
                    console.log('getRoleListPage',this.roles);
                })

            },
            editSubmit(){
                this.$refs.editForm.validate(valid=>{
                    if(valid){
                        this.$confirm('确认提交吗?','提示',{}).then(()=>{
                            this.editLoading=true;
                            let para=Object.assign({},this.editForm);
                            para.birth=(!para.birth || para.birth === '')?
                                utils.formatDate.format(new Date(),'yyyy-MM-dd'):
                                utils.formatDate.format(new Date(para.birth),'yyyy-MM-dd');
                            console.log('editSubmit',para);
                            editUser(para).then(res=>{
                                if(utils.isEmt.format(res)){
                                    this.editLoading=false;
                                    return;
                                }
                                if(res.data.success){
                                    this.editLoading=false;
                                    this.$message({
                                        message:res.data.msg,
                                        type:'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible=false;
                                    this.getUsers();
                                } else{
                                    this.$message({
                                        message:res.data.msg,
                                        type:'error'
                                    });
                                }
                            });
                        });
                    }
                })

            },
            //删除
            handleDel(index,row){
                this.$confirm('确认删除该记录吗?','提示',{
                    type:'waining'
                }).then(()=>{
                    this.listLoading=true;
                    let para ={uid:row.uID};
                    removeUser(para).then(res=>{
                        if(utils.isEmt.format(res)){
                            this.listLoading=false;
                            return;
                        }
                        this.listLoading=false;
                        if(res.data.success){
                            this.$message({
                                message:'删除成功',
                                type:'success'
                            });
                        }else {
                            this.$message({
                                message:res.data.msg,
                                type:'error'
                            });
                        }
                        this.getUsers();
                    });
                }).catch(()=>{});
            },
            batchRemove(){
                var ids=this.sels.map(item=>item.uID).toString();
                this.$confirm('确认删除选中的记录吗?','提示',{
                    type:'warning'
                }).then(()=>{
                    this.listLoading=true;
                    let para={ids:ids};
                    console.log('batchRemoveUser',para);
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '该功能未开放',
                            type: 'warning'
                        });
                        console.log(res)
                    });

                }).catch(()=>{});
            },
            //获取用户列表
            getUsers(){
                let para={
                    page:this.page,
                    key:this.filters.name
                };
                this.listLoading=true;
                getUserListPage(para).then(res=>{
                     this.total= res.data.response.dataCount;
                    this.users=res.data.response.data;
                    console.log('getUserListPage',this.users);
                    this.listLoading=false;
                });
            }
        },
        mounted() {
            this.getUsers();
        }
    }
</script>

<style scoped>

</style>
