  <template>
  <div class="company-wrap">
    <div class="search-top">
      <el-select v-model="companyStatus" @change="changeStatus" placeholder="请选择公司状态">
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
      <el-table-column prop="companyName" label="公司名称" width="100" align="center"></el-table-column>
      <el-table-column prop="abbreviation" label="公司简称" width="80" align="center"></el-table-column>
      <el-table-column prop="logo" label="LOGO" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" alt width="50px" height="50px" />
        </template>
      </el-table-column>
      <el-table-column label="行业领域" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.field | fieldFilter }}</template>
      </el-table-column>
      <el-table-column label="公司规模" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.scale | scaleFilter }}</template>
      </el-table-column>
      <el-table-column label="融资阶段" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.financing | financingFilter }}</template>
      </el-table-column>
      <el-table-column prop="companyAddress" label="公司地址" width="120" align="center"></el-table-column>
      <el-table-column prop="welfare" label="公司福利" width="80" align="center"></el-table-column>
      <el-table-column label="企业状态" width="80" align="center">
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
        <el-form-item label="公司名称">
          <el-input v-model="editUserInfo.companyName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司简称">
          <el-input v-model="editUserInfo.abbreviation" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="editUserInfo.companyAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司福利">
          <el-input v-model="editUserInfo.welfare" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="行业领域">
          <el-select v-model="editUserInfo.field" placeholder="请选择">
            <el-option
              v-for="item in fieldOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司规模">
          <el-select v-model="editUserInfo.scale" placeholder="请选择">
            <el-option
              v-for="item in scaleOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="融资阶段">
          <el-select v-model="editUserInfo.financing" placeholder="请选择">
            <el-option
              v-for="item in financingOption"
              :key="item.value"
              :label="item.value"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入公司介绍"
          v-model="editUserInfo.companyIntroduction"
        ></el-input>
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
import * as company from "@/api/company";

export default {
  data() {
    return {
      pages: null,
      value1: null,
      infoEdit: false,
      companyStatus: null,
      tableData: [],
      editUserInfo: {},
      statusOption: [
        {
          label: 0,
          value: "待审核",
        },
        {
          label: 1,
          value: "已审核",
        },
      ],
      fieldOption: [
        {
          label: 0,
          value: "移动互联网",
        },
        {
          label: 1,
          value: "电商",
        },
        {
          label: 2,
          value: "金融",
        },
        {
          label: 3,
          value: "企业服务",
        },
        {
          label: 4,
          value: "教育",
        },
        {
          label: 5,
          value: "文娱|内容",
        },
        {
          label: 6,
          value: "游戏",
        },
        {
          label: 7,
          value: "消费生活",
        },
        {
          label: 8,
          value: "硬件",
        },
      ],
      scaleOption: [
        {
          label: 0,
          value: "少于15人",
        },
        {
          label: 1,
          value: "15-50人",
        },
        {
          label: 2,
          value: "50-150人",
        },
        {
          label: 3,
          value: "150-500人",
        },
        {
          label: 4,
          value: "500-2000人",
        },
        {
          label: 5,
          value: "2000人以上",
        },
      ],
      financingOption: [
        {
          label: 0,
          value: "未融资",
        },
        {
          label: 1,
          value: "天使轮",
        },
        {
          label: 2,
          value: "A轮",
        },
        {
          label: 3,
          value: "B轮",
        },
        {
          label: 4,
          value: "C轮",
        },
        {
          label: 5,
          value: "D轮及以上",
        },
        {
          label: 6,
          value: "上市公司",
        },
        {
          label: 7,
          value: "不需要融资",
        },
      ],
      searchQuery: {},
    };
  },
  filters: {
    fieldFilter(val) {
      switch (val) {
        case 0:
          return "移动互联网";
        case 1:
          return "电商";
        case 2:
          return "金融";
        case 3:
          return "企业服务";
        case 4:
          return "教育";
        case 5:
          return "文娱|内容";
        case 6:
          return "游戏";
        case 7:
          return "消费生活";
        case 8:
          return "硬件";
      }
    },
    scaleFilter(val) {
      switch (val) {
        case 0:
          return "少于15人";
        case 1:
          return "15-50人";
        case 2:
          return "50-150人";
        case 3:
          return "150-500人";
        case 4:
          return "500-2000人";
        case 5:
          return "2000人以上";
      }
    },
    financingFilter(val) {
      switch (val) {
        case 0:
          return "未融资";
        case 1:
          return "天使轮";
        case 2:
          return "A轮";
        case 3:
          return "B轮";
        case 4:
          return "C轮";
        case 5:
          return "D轮及以上";
        case 6:
          return "上市公司";
        case 7:
          return "不需要融资";
      }
    },
  },
  methods: {
    handleCompanyList(page = 1, size = 5) {
      company.companyList(page, size, this.companyStatus).then((res) => {
        this.tableData = res.data.rows;
        this.pages = res.data.pages;
      });
    },
    handleEdit(id, data) {
      this.infoEdit = true;
      this.editUserInfo = JSON.parse(JSON.stringify(data));
      delete this.editUserInfo.status;
      delete this.editUserInfo.createTime;
    },
    handleReview(id, data) {
      this.$confirm(`是否审核${data.companyName}信息完毕?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        company.certification(id).then((res) => {
          this.handleCompanyList(1, 5, this.companyStatus)
          this.$message({
            type: "success",
            message: "审核成功!",
          });
        });
      });
    },
    handleSave() {
      this.infoEdit = false
      company.editCompany(this.editUserInfo.id, this.editUserInfo)
        .then(res => {
          this.handleCompanyList()
        })
    },
    changePage(page) {
      console.log(page);
    },
    changeStatus(status) {
      this.handleCompanyList(1, 5, status);
    },
  },
};
</script>

<style lang="scss" scoped>
.company-wrap {
  padding: 20px;
}
.search-top {
  margin: 30px 10px;
}
</style>