<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="dataList" row-key="permissionId" border style="width: 100%; ">
      <el-table-column prop="name" header-align="center" min-width="150" label="名称"></el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      ></el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="权限描述"
      ></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.permissionId, scope.row)"
          >修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.permissionId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog :title="maskTitle" :visible.sync="permissionShow" class="demo-ruleForm">
      <el-form :model="editData" status-icon label-width="100px">
        <div @click.self="parentMenu = false;iconShow = false;">
          <el-form-item label="名称">
            <el-input v-model="editData.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="URL">
            <el-input v-model="editData.url" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="editData.type" placeholder="请选择">
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-input
              v-model="editData.pid"
              autocomplete="off"
              readonly
              @focus="parentMenu = true;"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="editData.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="editData.icon" autocomplete="off" readonly @focus="iconShow = true;"></el-input>
          </el-form-item>
          <div class="icon-mask" v-show="iconShow">
            <ul>
              <li v-for="(item, index) in iconList" :key="index">
                <i :class="item" @click="changeIcon(item)"></i>
              </li>
            </ul>
          </div>
          <div class="parent-mask" v-show="parentMenu" @click.capture="1">
            <el-tree :data="dataList" :props="defaultProps" @node-click="nodeClick"></el-tree>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionShow = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">{{ maskBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeDataTranslate from "@/utils";
import * as permission from "@/api/permission";

export default {
  data() {
    return {
      parentMenu: false,
      iconShow: false,
      maskTitle: "权限新增",
      maskBtn: "新增",
      permissionShow: false,
      dataForm: null,
      dataList: [],
      iconList: [
        "el-icon-s-cooperation",
        "el-icon-s-platform",
        "el-icon-s-unfold",
        "el-icon-s-home",
        "el-icon-s-help",
        "el-icon-s-custom",
        "el-icon-user-solid",
        "el-icon-s-opportunity",
        "el-icon-menu",
        "el-icon-star-on",
        "el-icon-document",
        "el-icon-message",
        "el-icon-bangzhu",
        "el-icon-setting",
        "el-icon-position",
        "el-icon-chat-line-round",
        "el-icon-news",
        "el-icon-box",
        "el-icon-collection",
        "el-icon-collection-tag",
        "el-icon-reading",
        "el-icon-mobile",
      ],
      typeOption: [
        {
          label: "目录",
          value: 0,
        },
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "按钮",
          value: 2,
        },
      ],
      defaultProps: {
        label: "name",
      },
      editData: {
        permissionId: null,
        name: null,
        pid: null,
        url: null,
        type: null,
        description: null,
        icon: null,
      },
    };
  },
  mounted() {
    this.handlePermissionList();
  },
  methods: {
    handlePermissionList() {
      permission.tree().then((res) => {
        this.dataList = res.data;
      });
    },
    addOrUpdateHandle(id, data) {
      this.permissionShow = true;
      // 编辑
      if (data) {
        this.maskTitle = "权限编辑";
        this.maskBtn = "保存";
        this.editData.permissionId = data.permissionId;
        this.editData.name = data.name;
        this.editData.pid = data.pid;
        this.editData.url = data.url;
        this.editData.type = data.type;
        this.editData.description = data.description;
        this.editData.icon = data.icon;
        return;
      }
      // 新增
      this.maskTitle = "权限新增";
      this.maskBtn = "新增";
      this.editData = {};
    },
    deleteHandle(id) {
      this.$confirm("此操作将删除该权限及其所有子权限", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        permission.remove(id).then((res) => {
          this.handlePermissionList();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
      });
    },
    changeIcon(icon) {
      this.editData.icon = icon;
    },
    handleSave() {
      this.permissionShow = false;
      if (this.editData.permissionId) {
        permission.modify(this.editData.permissionId, this.editData)
          .then(res => {
            this.handlePermissionList()
            this.$message.success("保存成功");
          })
        return
      }
      permission.save(this.editData).then((res) => {
        this.handlePermissionList()
        this.$message.success("新增成功");
      });
    },
    nodeClick(data) {
      this.editData.pid = data.permissionId;
    },
  },
};
</script>

<style lang="scss" scoped>
.mod-menu {
  padding: 20px;
}
.demo-ruleForm /deep/ .el-form {
  position: relative;
}
.parent-mask {
  transform-origin: center bottom;
  z-index: 2019;
  position: absolute;
  top: 180px;
  left: 100px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}
.icon-mask {
  transform-origin: center bottom;
  z-index: 2019;
  position: absolute;
  top: 80px;
  left: 100px;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  ul {
    width: 458px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
    li {
      list-style: none;
      float: left;
      width: 36px;
      height: 36px;
      cursor: pointer;
      border-radius: 5px;
      margin: 8px 0 0 8px;
      line-height: 36px;
      text-align: center;
      border: 1px solid #dcdfe6;
      &:hover {
        color: #409eff;
      }
      i {
        font-size: 24px;
      }
    }
  }
}
</style>