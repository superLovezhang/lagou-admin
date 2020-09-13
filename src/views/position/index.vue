  <template>
  <div class="position-wrap">
    <div class="search-top">
      <el-input v-model="searchQuery.positionName" placeholder="请输入职位名称" style="width: auto"></el-input>
      <el-input v-model="searchQuery.workAddress" placeholder="请输入工作地点" style="width: auto"></el-input>
      <el-select v-model="searchQuery.education" placeholder="请选择学历">
        <el-option
          v-for="item in educationOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-select v-model="searchQuery.experience" placeholder="请选择工作经验">
        <el-option
          v-for="item in experienceOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-select v-model="searchQuery.recruitment" placeholder="请选择工作类型">
        <el-option
          v-for="item in recruitmentOption"
          :key="item.value"
          :label="item.value"
          :value="item.label"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="positionName" label="职位名称" width="130" align="center"></el-table-column>
      <el-table-column label="学历" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.education | educationFilter }}</template>
      </el-table-column>
      <el-table-column label="工作经验" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.experience | experienceFilter }}</template>
      </el-table-column>
      <el-table-column label="类型" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.recruitmentType | recruitmentFilter }}</template>
      </el-table-column>
      <el-table-column label="薪资" width="80" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.salaryBegin + "K" + "-" + scope.row.salaryEnd + "K" }}</template>
      </el-table-column>
      <el-table-column prop="workAddress" label="工作地址" width="180" align="center"></el-table-column>
      <el-table-column prop="temptation" label="职位诱惑" width="180" align="center"></el-table-column>
      <el-table-column prop="department" label="招聘部门" width="80" align="center"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id, scope.row)">删除</el-button>
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
        <el-form-item label="职位名称">
          <el-input v-model="editUserInfo.positionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="要求学历">
          <!-- <el-input v-model="editUserInfo.sex" autocomplete="off"></el-input> -->
          <el-select v-model="editUserInfo.education" placeholder="请选择">
            <el-option
              v-for="item in educationOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作经验">
          <!-- <el-input v-model="editUserInfo.sex" autocomplete="off"></el-input> -->
          <el-select v-model="editUserInfo.experience" placeholder="请选择">
            <el-option
              v-for="item in experienceOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘类型">
          <!-- <el-input v-model="editUserInfo.sex" autocomplete="off"></el-input> -->
          <el-select v-model="editUserInfo.recruitmentType" placeholder="请选择">
            <el-option
              v-for="item in recruitmentOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工作地点">
          <el-input v-model="editUserInfo.workAddress"></el-input>
        </el-form-item>
        <el-form-item label="工作福利">
          <el-input v-model="editUserInfo.temptation"></el-input>
        </el-form-item>
        <el-form-item label="职位关键词">
          <el-input v-model="editUserInfo.positionKeyword" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-input-number v-model="editUserInfo.salaryBegin" :precision="2" :step="0.1" :min="0.1"></el-input-number>K —
          <el-input-number v-model="editUserInfo.salaryEnd" :precision="2" :step="0.1" :min="0.1"></el-input-number>K
        </el-form-item>
        <el-form-item label="招聘部门">
          <el-input v-model="editUserInfo.department" placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入职位描述"
            v-model="editUserInfo.positionDescription"
          ></el-input>
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
import * as position from "@/api/position";

export default {
  data() {
    return {
      pages: null,
      value1: null,
      infoEdit: false,
      tableData: [],
      editUserInfo: {},
      educationOption: [
        {
          label: 0,
          value: "大专",
        },
        {
          label: 1,
          value: "本科",
        },
        {
          label: 2,
          value: "硕士",
        },
        {
          label: 3,
          value: "博士",
        },
        {
          label: 4,
          value: "不要求",
        },
      ],
      experienceOption: [
        {
          label: 0,
          value: "应届毕业生",
        },
        {
          label: 1,
          value: "3年及其以下",
        },
        {
          label: 2,
          value: "3-5年",
        },
        {
          label: 3,
          value: "5-10年",
        },
        {
          label: 4,
          value: "10年以上",
        },
        {
          label: 5,
          value: "不要求",
        },
      ],
      recruitmentOption: [
        {
          label: 0,
          value: "全职",
        },
        {
          label: 1,
          value: "兼职",
        },
        {
          label: 3,
          value: "实习",
        },
      ],
      searchQuery: {},
    };
  },
  filters: {
    educationFilter(val) {
      switch (val) {
        case 0:
          return "大专";
        case 1:
          return "本科";
        case 2:
          return "硕士";
        case 3:
          return "博士";
        case 4:
          return "不要求";
      }
    },
    experienceFilter(val) {
      switch (val) {
        case 0:
          return "应届毕业生";
        case 1:
          return "3年及其以下";
        case 2:
          return "3-5年";
        case 3:
          return "5-10年";
        case 4:
          return "10年以上";
        case 5:
          return "不要求";
      }
    },
    recruitmentFilter(val) {
      switch (val) {
        case 0:
          return "全职";
        case 1:
          return "兼职";
        case 2:
          return "实习";
      }
    },
  },
  mounted() {
    this.handlePositionList()
  },
  methods: {
    handlePositionList(page = 1, size = 5) {
      position.positionList(page, size, this.searchQuery).then((res) => {
        this.tableData = res.data.rows;
        this.pages = res.data.pages;
      });
    },
    handleEdit(id, data) {
      this.infoEdit = true;
      this.editUserInfo = JSON.parse(JSON.stringify(data));
      delete this.editUserInfo.field
      delete this.editUserInfo.scale
      delete this.editUserInfo.financing
    },
    handleDelete(id, data) {
      this.$confirm(`此操作将删除${data.positionName}职位, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        position.removePosition(id).then((res) => {
          this.handlePositionList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    handleSave() {
      this.infoEdit = false;
      position
        .editPosition(this.editUserInfo.id, this.editUserInfo)
        .then((res) => this.handlePositionList());
    },
    changePage(page) {
      this.handlePositionList(page, 5);
    },
    handleSearch() {
      this.handlePositionList()
    }
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