<template>
  <div class="p-4 pt-12">
    <StoreUtilityDetail
      v-if="selectedPostId"
      v-model:open="showStoreUtilityDetailPopup"
      :postId="selectedPostId"
    />

    <div class="flex items-center justify-between mb-4">
      <!-- Khu vực tìm kiếm và lọc -->
      <div class="flex gap-4">
        <a-input
          v-model:value="searchText"
          placeholder="Nhập Tiêu đề bài viết..."
          style="width: 300px"
          allowClear
          class="custom-search"
          @input="handleSearch"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>

        <!-- Bộ lọc Loại hình -->
        <a-select
          v-model:value="selectedStoreUtilityType"
          placeholder="Loại hình"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'CUA_HANG'">Cửa hàng</a-select-option>
          <a-select-option :value="'TIEN_ICH'">TIện ích</a-select-option>
        </a-select>

        <!-- Bộ lọc Phân loại Cửa hàng - chỉ hiển thị khi chọn Cửa hàng -->
        <a-select
          v-if="selectedStoreUtilityType === 'CUA_HANG'"
          v-model:value="selectedSecondMotel"
          placeholder="Phân loại"
          style="width: 150px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="Tạp hóa">Tạp hóa</a-select-option>
          <a-select-option value="Cửa hàng tiện lợi"
            >Cửa hàng tiện lợi</a-select-option
          >
          <a-select-option value="Văn phòng phẩm"
            >Văn phòng phẩm</a-select-option
          >
          <a-select-option value="Điện lạnh">Điện lạnh</a-select-option>
          <a-select-option value="Gia dụng">Gia dụng</a-select-option>
          <a-select-option value="Hiệu thuốc">Hiệu thuốc</a-select-option>
          <a-select-option value="Quần áo">Quần áo</a-select-option>
          <a-select-option value="Hiệu sách">Hiệu sách</a-select-option>
          <a-select-option value="Điện thoại">Điện thoại</a-select-option>
          <a-select-option value="Máy tính">Máy tính</a-select-option>
          <a-select-option value="Đồng hồ">Đồng hồ</a-select-option>
          <a-select-option value="Kính mắt">Kính mắt</a-select-option>
        </a-select>

        <!-- Bộ lọc Phân loại - chỉ hiển thị khi chọn Cửa hàng -->
        <a-select
          v-if="selectedStoreUtilityType === 'TIEN_ICH'"
          v-model:value="selectedSecondMotel"
          placeholder="Phân loại"
          style="width: 150px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option value="Photocopy">Photocopy</a-select-option>
          <a-select-option value="Giặt là">Giặt là</a-select-option>
          <a-select-option value="Học ngoại ngữ">Học ngoại ngữ</a-select-option>
          <a-select-option value="Chụp ảnh">Chụp ảnh</a-select-option>
        </a-select>

        <!-- Bộ lọc trạng thái -->
        <a-select
          v-model:value="selectedStatus"
          placeholder="Trạng thái"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'APPROVED'">Đã duyệt</a-select-option>
          <a-select-option :value="'BLOCKED'">Bị khóa</a-select-option>
          <a-select-option :value="'PENDING'">Chờ duyệt</a-select-option>
        </a-select>

        <!-- Bộ lọc Hiển thị -->
        <a-select
          v-model:value="selectedDel"
          placeholder="Hiển thị"
          style="width: 120px"
          @change="handleFilterChange"
        >
          <a-select-option :value="null">Tất cả</a-select-option>
          <a-select-option :value="'false'">Hiển thị</a-select-option>
          <a-select-option :value="'true'">Bị ẩn</a-select-option>
        </a-select>

        <!-- Bộ lọc theo UserId -->
        <a-input
          v-model:value="selectedUserId"
          placeholder="userId..."
          style="width: 90px"
          @input="handleFilterChange"
        >
          <template #prefix>
            <SearchOutlined class="text-gray-200" />
          </template>
        </a-input>
      </div>
    </div>

    <!-- Bảng danh sách bài viết -->
    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      :pagination="pagination"
      row-key="id"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- STT -->
        <template v-if="column.key === 'stt'">
          {{ index + 1 + pagination.pageSize * (pagination.current - 1) }}
        </template>

        <template v-if="column.key === 'motel'">
          <span
            :style="{
              color:
                record.accomodationDTO &&
                record.accomodationDTO.motel === 'CUA_HANG'
                  ? 'green'
                  : record.accomodationDTO &&
                    record.accomodationDTO.motel === 'TIEN_ICH'
                  ? 'red'
                  : 'black',
              fontWeight: 'bold',
            }"
          >
            {{
              record.accomodationDTO &&
              record.accomodationDTO.motel === "CUA_HANG"
                ? "Cửa hàng"
                : record.accomodationDTO &&
                  record.accomodationDTO.motel === "TIEN_ICH"
                ? "TIện ích"
                : "Không xác định"
            }}
          </span>
        </template>

        <template v-if="column.key === 'secondMotel'">
          {{ record.accomodationDTO.secondMotel }}
        </template>

        <!-- Tiêu đề -->
        <template v-if="column.key === 'title'">
          {{ record.title }}
        </template>

        <!-- Ngày tạo -->
        <template v-if="column.key === 'createAt'">
          <!-- Thay thế 'T' bằng khoảng trắng -->
          {{
            record.createAt
              ? record.createAt.replace("T", " ")
              : "Không có dữ liệu"
          }}
        </template>

        <!-- Trạng thái duyệt -->
        <template v-if="column.key === 'approved'">
          <a-tag
            :color="
              record.approved && !record.notApproved
                ? 'green'
                : record.approved && record.notApproved
                ? 'orange'
                : 'red'
            "
          >
            {{
              record.approved && !record.notApproved
                ? "Đã duyệt"
                : record.approved && record.notApproved
                ? "Chờ duyệt"
                : "Bị khóa"
            }}
          </a-tag>
        </template>

        <!-- Cột Hiển thị -->
        <template v-if="column.key === 'del'">
          <a-tag :color="record.del ? 'red' : 'green'">
            {{ record.del ? "Bị ẩn" : "Hiển thị" }}
          </a-tag>
        </template>

        <!-- Người đăng -->
        <template v-if="column.key === 'user'">
          {{ record.userDTO ? record.userDTO.fullName : "Không có thông tin" }}
        </template>

        <!-- Hành động -->
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="viewPost(record)">
            <template #icon><EyeOutlined /></template>
          </a-button>

          <a-button type="link" danger @click="confirmDelete(record)">
            <template #icon><DeleteOutlined /></template>
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getListPost, deletePost } from "@/apis/postService";
import { message, Modal } from "ant-design-vue";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import StoreUtilityDetail from "./StoreUtilityDetail.vue";

export default {
  components: {
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,

    StoreUtilityDetail,
  },
  setup() {
    const posts = ref([]);
    const loading = ref(false);
    const searchText = ref("");
    const selectedStatus = ref(null);
    const pagination = ref({
      current: 1,
      pageSize: 6,
      total: 0,
      showTotal: (total, range) => `Tổng cộng: ${total} bản ghi`,
    });
    const showStoreUtilityDetailPopup = ref(false);
    const selectedPostId = ref(null);
    const selectedUserId = ref(null);
    const selectedDel = ref(null); // Định nghĩa lọc Hiển thị
    const selectedStoreUtilityType = ref(null); // Định nghĩa lọc Loại hình
    const selectedSecondMotel = ref(null);

    // Cấu hình các cột cho bảng
    const columns = [
      { title: "STT", key: "stt" },
      { title: "ID", dataIndex: "id", key: "id" },

      { title: "Tiêu đề", dataIndex: "title", key: "title" },
      { title: "Loại hình", dataIndex: "motel", key: "motel" },
      { title: "Phân loại", dataIndex: "secondMotel", key: "secondMotel" },
      { title: "Ngày tạo", dataIndex: "createAt", key: "createAt" },
      { title: "Trạng thái", key: "approved" },
      { title: "Người đăng", key: "user" },
      { title: "Hiển thị", dataIndex: "del", key: "del" }, // Cột hiển thị
      // Cột người đăng
      { title: "Hành động", key: "action", width: 96 },
    ];

    // Fetch danh sách bài viết từ API
    const fetchPosts = async () => {
      loading.value = true;
      try {
        const params = {
          start: Math.max(pagination.value.current - 1, 0),
          limit: pagination.value.pageSize,
          keywords: searchText.value.trim(),
        };

        // Logic lọc trạng thái
        switch (selectedStatus.value) {
          case "APPROVED":
            params.approved = true;
            params.notApproved = false;
            break;
          case "BLOCKED":
            params.approved = false;
            break;
          case "PENDING":
            params.approved = true;
            params.notApproved = true;
            break;
          default:
            break;
        }

        // Lọc theo UserId
        if (selectedUserId.value) {
          params.userId = selectedUserId.value;
        }

        // Lọc theo Hiển thị (del)
        if (selectedDel.value) {
          params.del = selectedDel.value;
        }

        // Lọc theo Loại hình (accomodationDTO.motel)
        if (selectedStoreUtilityType.value === "CUA_HANG") {
          params.motel = "CUA_HANG";
        } else if (selectedStoreUtilityType.value === "TIEN_ICH") {
          params.motel = "TIEN_ICH";
        } else {
          // Nếu không chọn lọc cụ thể, gửi cả hai giá trị
          params.motels = "CUA_HANG,TIEN_ICH";
        }

        if (selectedSecondMotel.value) {
          params.secondMotel = selectedSecondMotel.value;
        }

        // Log dữ liệu lọc gửi đi
        console.log("Params gửi đi:", params);
        const res = await getListPost(params);

        if (res.data && res.data.items) {
          posts.value = res.data.items;
          pagination.value.total = res.data.total || 0;
        } else {
          throw new Error("Dữ liệu API không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        message.error(`Lỗi tải danh sách bài viết: ${error.message}`);
      }
      loading.value = false;
    };

    // Xử lý khi thay đổi phân trang
    const handleTableChange = (paginationObj) => {
      pagination.value.current = Math.max(paginationObj.current, 1);
      pagination.value.pageSize = paginationObj.pageSize;
      fetchPosts();
    };

    // Xử lý khi người dùng tìm kiếm
    const handleSearch = () => {
      pagination.value.current = 1;
      fetchPosts();
    };

    // Xử lý khi người dùng thay đổi bộ lọc
    const handleFilterChange = () => {
      pagination.value.current = 1;
      fetchPosts();
    };

    const viewPost = (record) => {
      selectedPostId.value = record.id;
      showStoreUtilityDetailPopup.value = true;
    };

    // Xác nhận và xóa bài viết
    const confirmDelete = (record) => {
      Modal.confirm({
        title: "Xóa bài viết",
        content: "Bạn có chắc chắn muốn xóa bài viết này?",
        okText: "Xóa",
        cancelText: "Hủy",
        async onOk() {
          try {
            await deletePost(record.id);
            message.success("Xóa bài viết thành công");
            fetchPosts();
          } catch {
            message.error("Xóa thất bại");
          }
        },
      });
    };

    onMounted(fetchPosts);

    return {
      posts,
      columns,
      loading,
      searchText,
      selectedStatus,
      pagination,
      fetchPosts,
      handleTableChange,
      handleSearch,
      handleFilterChange,
      confirmDelete,
      viewPost,

      showStoreUtilityDetailPopup,
      selectedPostId,

      selectedUserId,
      selectedStoreUtilityType,
      selectedDel,
      selectedSecondMotel,
    };
  },
};
</script>
