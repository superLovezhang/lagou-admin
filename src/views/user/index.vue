  <template>
  <div class="user-wrap">
    <div class="search-top">
      <el-input v-model="searchQuery.username" placeholder="请输入用户名" style="width: auto"></el-input>
      <el-input v-model="searchQuery.phone" placeholder="请输入手机号" style="width: auto"></el-input>
      <el-input v-model="searchQuery.city" placeholder="请输入城市" style="width: auto"></el-input>
      <el-select v-model="searchQuery.sex" placeholder="请选择性别">
        <el-option
          v-for="item in sexOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-select v-model="searchQuery.identity" placeholder="请选择身份">
        <el-option
          v-for="item in identityOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100" align="center"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.sex === 0 ? '女' : '男' }}</template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="120" align="center"></el-table-column>
      <el-table-column prop="city" label="城市" width="50" align="center"></el-table-column>
      <el-table-column label="身份" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.identity === 0 ? '学生' : '非学生' }}</template>
      </el-table-column>
      <el-table-column prop="socialHomepage" label="主页" width="180" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180" align="center"></el-table-column>
      <el-table-column label="账号状态" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.status === 0 ? '正常' : '封禁中' }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            v-if="scope.row.status === 0"
            type="danger"
            @click="handleFreeze(scope.row.id, scope.row)"
          >封禁</el-button>
          <el-button
            size="mini"
            v-else
            type="success"
            @click="handleFreeze(scope.row.id, scope.row)"
          >解封</el-button>
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
        <el-form-item label="用户名">
          <el-input v-model="editUserInfo.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <!-- <el-input v-model="editUserInfo.sex" autocomplete="off"></el-input> -->
          <el-select v-model="editUserInfo.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editUserInfo.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.number="editUserInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="editUserInfo.city"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <!-- <el-input v-model.number="editUserInfo.identity"></el-input> -->
          <el-select v-model="editUserInfo.identity" placeholder="请选择">
            <el-option
              v-for="item in identityOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主页地址">
          <el-input v-model="editUserInfo.socialHomepage"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserInfo.email"></el-input>
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
import * as user from "@/api/user";

export default {
  data() {
    return {
      pages: null,
      value1: null,
      infoEdit: false,
      tableData: [],
      editUserInfo: {
        id: null,
        username: null,
        sex: null,
        avatar: null,
        phone: null,
        birthday: null,
        city: null,
        identity: null,
        socialHomepage: null,
        email: null,
      },
      sexOption: [
        {
          label: 0,
          value: "女",
        },
        {
          label: 1,
          value: "男",
        },
      ],
      identityOption: [
        {
          label: 0,
          value: "学生",
        },
        {
          label: 1,
          value: "非学生",
        },
      ],
      searchQuery: {},
    };
  },
  mounted() {
    this.handleGatherUserList();
  },
  methods: {
    handleGatherUserList(page = 1, size = 5, searchQuery = {}) {
      user.userList(page, size, searchQuery).then((res) => {
        this.tableData = res.data.rows;
        this.pages = res.data.pages;
      });
    },
    handleEdit(id, data) {
      this.infoEdit = true;
      this.editUserInfo.id = data.id;
      this.editUserInfo.username = data.username;
      this.editUserInfo.sex = data.sex;
      this.editUserInfo.avatar = data.avatar;
      this.editUserInfo.phone = data.phone;
      this.editUserInfo.birthday = data.birthday;
      this.editUserInfo.city = data.city;
      this.editUserInfo.identity = data.identity;
      this.editUserInfo.socialHomepage = data.socialHomepage;
      this.editUserInfo.email = data.email;
    },
    handleSave() {
      this.infoEdit = false;
      let userInfo = this.editUserInfo;
      user.editUser(userInfo.id, userInfo).then((res) => {
        this.$message.success("保存成功");
        this.handleGatherUserList();
      });
    },
    handleFreeze(id, data) {
      this.$confirm(
        `此操作将${data.status === 0 ? "封禁" : "解封"}${
          data.username
        }, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        user.userStatus(id, data.status === 0 ? 1 : 0).then((res) => {
          this.$message({
            type: "success",
            message: `${data.status === 0 ? "封禁" : "解封"}成功!`,
          });
          this.handleGatherUserList()
        });
      });
    },
    changePage(page) {
      console.log(page);
    },
    handleSearch() {
      this.handleGatherUserList(1, 5, this.searchQuery).then(
        (res) => (this.searchQuery = {})
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.user-wrap {
  padding: 20px;
}
.search-top {
  margin: 30px 10px;
}
</style>