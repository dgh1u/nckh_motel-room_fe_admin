<template>
  <div class="p-4 pt-12">
    <div class="mb-4 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center space-x-2 flex-wrap gap-2">
        <span>Lọc theo ngày: </span>
        <a-date-picker
          v-model:value="startDate"
          placeholder="Từ ngày"
          @change="handleDateChange"
          :disabled-date="disabledStartDate"
        />
        <MoveRightIcon class="ml-2 h-4 w-4" />
        <a-date-picker
          v-model:value="endDate"
          placeholder="Đến ngày"
          @change="handleDateChange"
          :disabled-date="disabledEndDate"
        />
        <span class="ml-10">UserID: </span>
        <a-input
          v-model:value="searchUserId"
          placeholder="Nhập UserID..."
          allow-clear
          style="width: 150px"
        />
      </div>
      <span class="text-gray-700">
        Doanh thu: {{ totalDeposited.toLocaleString() }}₫
      </span>
    </div>

    <a-table
      :columns="columns"
      :data-source="paymentItems"
      row-key="id"
      :pagination="pagination"
      bordered
      @change="handleTableChange"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch, h } from "vue";
import { getListPayment } from "@/apis/paymentService.js";
import { message, Tag } from "ant-design-vue";
import dayjs from "dayjs";
import { MoveRightIcon } from "lucide-vue-next";
import { getBankData } from "../../components/bank-name/bankName";

// Dữ liệu reactive
const paymentItems = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const searchUserId = ref(null);

// Cột bảng
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 10,
  },
  {
    title: "UserID",
    dataIndex: "userId",
    key: "userId",
    width: 5,
  },
  {
    title: "Mã giao dịch",
    dataIndex: "orderCode",
    key: "orderCode",
  },
  {
    title: "Ngày nạp",
    dataIndex: "transactionDateTime",
    key: "transactionDateTime",
  },
  {
    title: "Số tài khoản",
    dataIndex: "counterAccountNumber",
    key: "counterAccountNumber",
  },
  {
    title: "Ngân hàng",
    dataIndex: "counterAccountBankId",
    key: "counterAccountBankId",
    customRender: ({ text }) => {
      const bankData = getBankData(text);
      return h("div", { class: "flex items-center space-x-2" }, [
        bankData.logo
          ? h("img", { src: bankData.logo, alt: "Bank Logo", class: "w-8" })
          : null,
        h("span", { class: "text-gray-600" }, bankData.name),
      ]);
    },
  },
  {
    title: "Số tiền nạp",
    dataIndex: "amount",
    key: "amount",
    render: (text) => `${text} VND`,
  },
  {
    title: "Trạng thái",
    dataIndex: "success",
    key: "success",
    customRender: ({ text }) => {
      const statusMap = {
        true: { color: "green", label: "Thành công" },
        false: { color: "red", label: "Thất bại" },
      };
      const status = statusMap[text];
      return h(
        Tag,
        {
          color: status.color,
          bordered: true,
        },
        () => status.label
      );
    },
  },
];

// Phân trang
const pagination = ref({
  current: 1,
  pageSize: 6,
  total: 0,
  showTotal: (total) => `Tổng cộng: ${total} bản ghi`,
});

// Gọi API
async function fetchPayments() {
  try {
    const params = {
      start: Math.max(pagination.value.current - 1, 0),
      limit: pagination.value.pageSize,
      startDate: startDate.value ? startDate.value.format("YYYY-MM-DD") : null,
      endDate: endDate.value ? endDate.value.format("YYYY-MM-DD") : null,
      userId: searchUserId.value || null,
    };
    const res = await getListPayment(params);
    if (res.data && res.data.items) {
      paymentItems.value = res.data.items;
      pagination.value.total = res.data.total || 0;
    } else {
      throw new Error("Dữ liệu API không hợp lệ");
    }
  } catch (error) {
    message.error(`Lỗi tải dữ liệu: ${error.message}`);
  }
}

// Theo dõi input userId và gọi API (AJAX-like)
watch(searchUserId, () => {
  pagination.value.current = 1;
  fetchPayments();
});

// Đổi phân trang
function handleTableChange(paginationObj) {
  pagination.value.current = Math.max(paginationObj.current, 1);
  pagination.value.pageSize = paginationObj.pageSize;
  fetchPayments();
}

// Tính tổng doanh thu từ các giao dịch thành công
const totalDeposited = computed(() =>
  paymentItems.value.reduce(
    (sum, item) => sum + (item.success === true ? item.amount || 0 : 0),
    0
  )
);

// Giới hạn ngày chọn
function disabledEndDate(current) {
  if (!startDate.value) return false;
  return current && !current.isAfter(startDate.value, "day");
}
function disabledStartDate(current) {
  if (!endDate.value) return false;
  return current && !current.isBefore(endDate.value, "day");
}

function handleDateChange() {
  pagination.value.current = 1;
  fetchPayments();
}

onMounted(() => {
  fetchPayments();
});
</script>
