  <template>
  <div class="position-wrap">
    <div class="search-top">
      <el-input v-model="searchQuery.adminName" placeholder="请输入名称" style="width: auto"></el-input>
      <el-button type="primary" @click="handleSaveOrEdit">新增</el-button>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="adminId" label="id" width="180" align="center"></el-table-column>
      <el-table-column prop="adminName" label="用户名称" width="180" align="center"></el-table-column>
      <el-table-column prop="account" label="账号" width="180" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSaveOrEdit(scope.row.adminId, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.adminId, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="信息编辑" :visible.sync="infoEdit">
      <el-form
        :model="editUserInfo"
        status-icon
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editUserInfo.adminName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="editUserInfo.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserInfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="editUserInfo.roleIds"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>

    <div style="width: 30%; margin: 50px auto;">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :page-size="5"
        :page-count="pages"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import * as admin from "@/api/admin";
import { roleList } from "@/api/role";

export default {
  data() {
    return {
      pages: null,
      infoEdit: false,
      tableData: [],
      editUserInfo: {},
      searchQuery: {},
      roleOptions: []
    };
  },
  mounted() {
    this.handleRoleOptions()
    this.handleAdminList();
  },
  methods: {
    handleRoleOptions() {
      roleList(1, 20, null).then(res => {
        let result = res.data.rows
        for (let i = 0; i < result.length; i++) {
          this.roleOptions.push({
            label: result[i].roleName,
            value: result[i].roleId
          })
        }
      })
    },
    handleAdminList(page = 1, size = 5) {
      admin.adminList(page, size, this.searchQuery.adminName).then((res) => {
        this.tableData = res.data.rows;
        this.pages = res.data.pages;
      });
    },
    handleSaveOrEdit(id = null, data = null) {
      this.infoEdit = true;
      if (data) {
        this.editUserInfo = JSON.parse(JSON.stringify(data));
        delete this.editUserInfo.status;
        delete this.editUserInfo.createTime;
        return;
      }
      this.editUserInfo = {};
    },
    handleDelete(id, data) {
      this.$confirm(
        `此操作将删除【${data.adminName}】用户, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        admin.remove(id).then((res) => {
          this.handleAdminList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    changePage(page) {
      this.handleAdminList(page);
    },
    handleSave() {
      this.infoEdit = false;
      if (this.editUserInfo.adminId) {
        admin
          .editAdmin(this.editUserInfo.adminId, this.editUserInfo)
          .then((res) => {
            this.handleAdminList();
            this.$message.success('保存成功')
          });
        return;
      }
      admin.add(this.editUserInfo).then((res) => {
        this.$message.success('新增成功')
        this.handleAdminList();
      });
    },
    handleSearch() {
      this.handleAdminList(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.position-wrap {
  padding: 20px;
}
.search-top {
  margin: 30px 10px;
}
</style>