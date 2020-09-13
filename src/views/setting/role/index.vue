  <template>
  <div class="position-wrap">
    <div class="search-top">
      <el-input v-model="searchQuery.roleName" placeholder="请输入名称" style="width: auto"></el-input>
      <el-button type="primary" @click="handleSaveOrEdit">新增</el-button>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="roleId" label="id" width="180" align="center"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180" align="center"></el-table-column>
      <el-table-column prop="roleDescription" label="角色描述" width="180" align="center"></el-table-column>
      <el-table-column label="状态" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain disabled v-if="scope.row.status === 0">正常</el-button>
          <el-button type="danger" plain disabled v-else>冻结</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSaveOrEdit(scope.row.roleId, scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleChangePermission(scope.row.roleId, scope.row)">权限分配</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色编辑 -->
    <el-dialog title="角色编辑" :visible.sync="infoEdit">
      <el-form
        :model="editUserInfo"
        status-icon
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editUserInfo.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editUserInfo.roleDescription" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editUserInfo.status" :active-value="0" :inactive-value="1"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog title="权限分配" :visible.sync="permissionAssign">
      <el-tree
        ref="tree"
        :data="data"
        node-key="permissionId"
        default-expand-all
        show-checkbox
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionAssign = false">取 消</el-button>
        <el-button type="primary" @click="handleAssign">分 配</el-button>
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
import * as role from "@/api/role";
import * as permission from "@/api/permission";

export default {
  data() {
    return {
      pages: null,
      infoEdit: false,
      permissionAssign: false,
      tableData: [],
      editUserInfo: {
        roleId: null,
        roleName: null,
        roleDescription: null,
        status: null,
      },
      searchQuery: {
        roleName: "",
      },
      data: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    this.handlePermissionList();
    this.handleRoleList();
  },
  methods: {
    handlePermissionList() {
      permission.tree().then((res) => {
        this.data = res.data;
      });
    },
    handleRoleList(page = 1, size = 5, roleName = null) {
      role.roleList(page, size, roleName).then((res) => {
        this.tableData = res.data.rows;
        this.pages = res.data.pages;
      });
    },
    handleSaveOrEdit(id, data) {
      this.infoEdit = true;
      if (data) {
        this.editUserInfo.roleId = data.roleId;
        this.editUserInfo.roleName = data.roleName;
        this.editUserInfo.roleDescription = data.roleDescription;
        this.editUserInfo.status = data.status;
        return;
      }
      this.editUserInfo = {};
    },
    handleDelete(data) {
      this.$confirm(`此操作将删除【${data.roleName}】角色, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        role.remove(data.roleId).then((res) => {
          this.handleRoleList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    handleChangePermission(id, data) {
      this.permissionAssign = true;
      this.editUserInfo.roleId = id
      window.setTimeout(() => this.$refs.tree.setCheckedKeys(data.permissionIds), 100)
    },
    changePage(page) {
      this.handleRoleList(page, 5)
    },
    handleSave() {
      this.infoEdit = false;
      if (this.editUserInfo.roleId) {
        role.modify(this.editUserInfo.roleId, this.editUserInfo).then((res) => {
          this.handleRoleList();
        });
        return;
      }
      role.save(this.editUserInfo).then((res) => {
        this.$message.success("新增成功");
        this.handleRoleList();
      });
    },
    handleSearch() {
      this.handleRoleList(1, 5, this.searchQuery.roleName);
    },
    handleAssign() {
      this.permissionAssign = false;
      let allKeys = this.$refs.tree.getCheckedKeys();
      let halfKeys = this.$refs.tree.getHalfCheckedKeys();
      if (halfKeys.length !== 0) {
        allKeys.push.apply(allKeys, halfKeys);
      }
      role.addPermission(this.editUserInfo.roleId, allKeys).then((res) => {
        this.$message.success("权限分配成功");
      });
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