  <template>
  <div class="employee-wrap">
    <div class="search-top">
      <el-select v-model="dataStatus" @change="changeStatus" placeholder="请选择员工状态">
        <el-option
          v-for="item in statusOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="员工名称" width="100" align="center"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.sex === 0 ? '女' : '男' }}</template>
      </el-table-column>
      <el-table-column prop="position" label="职位" width="120" align="center"></el-table-column>
      <el-table-column prop="email" label="接收简历邮箱" width="180" align="center"></el-table-column>
      <el-table-column label="认证状态" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.status === 1 ? '已认证' : '未认证' }}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            v-if="scope.row.status === 0"
            type="success"
            @click="handleReview(scope.row.id, scope.row)"
          >审核</el-button>
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
        <el-form-item label="员工名">
          <el-input v-model="editUserInfo.name" autocomplete="off"></el-input>
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
        <el-form-item label="职位">
          <el-input v-model.number="editUserInfo.position"></el-input>
        </el-form-item>
        <el-form-item label="接受简历邮箱">
          <el-input v-model.number="editUserInfo.email"></el-input>
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
import * as employee from "@/api/employee";

export default {
  data() {
    return {
      dataStatus: null,
      pages: null,
      value1: null,
      infoEdit: false,
      tableData: [],
      editUserInfo: {},
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
      statusOption: [
        {
          label: 0,
          value: "待审核",
        },
        {
          label: 1,
          value: "已审核",
        },
      ]
    };
  },
  methods: {
    handleGatherEmployeeList(page = 1, size = 5, status = 0) {
      employee.employeeList(page, size, status).then((res) => {
        this.tableData = res.data.rows
        this.pages = res.data.pages
      });
    },
    handleEdit(id, data) {
      this.infoEdit = true;
      this.editUserInfo = JSON.parse(JSON.stringify(data))
    },
    handleReview(id, data) {
      this.$confirm(`是否审核${data.name}信息完毕?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        employee.reviewEmployee(id).then((res) => {
          this.handleGatherEmployeeList(1, 5, this.dataStatus)
          this.$message({
            type: "success",
            message: "审核成功!",
          });
        });
      });
    },
    changePage(page) {
      this.handleGatherEmployeeList(page, 5, this.dataStatus)
    },
    changeStatus(status) {
      this.handleGatherEmployeeList(1, 5, status)
    },
    handleSave() {
      this.infoEdit = false
      employee.editEmployee(this.editUserInfo.id, this.editUserInfo)
        .then(res => {
          this.handleGatherEmployeeList(1, 5, this.dataStatus)
          this.$message.success('保存成功')
        })
    }
  },
};
</script>

<style lang="scss" scoped>
.employee-wrap {
  padding: 20px;
}
.search-top {
  margin: 30px 10px;
}
</style>