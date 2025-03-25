<template>
  <a-modal
    v-model:open="modalVisible"
    :footer="null"
    @cancel="handleClose"
    width="800px"
  >
    <div class="create-post max-w-3xl mx-auto p-4 space-y-4">
      <div class="block items-center justify-center flex">
        <span class="font-bold text-3xl text-teal-500">Chi tiết tin đăng</span>
      </div>

      <!-- Hình thức -->
      <div class="block bg-white rounded-xl">
        <div class="py-2">
          <span class="font-bold text-base">Hình thức</span>
        </div>
        <label>Loại hình <span class="text-red-500">*</span></label>
        <div class="flex rounded-lg mt-1 p-2">
          <span class="font-bold" :class="motelColor">{{ displayMotel }}</span>
        </div>
        <!-- Trường trạng thái -->
        <div class="py-2">
          <label>Trạng thái</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagStatusColor" class="font-bold">{{
              displayStatus
            }}</a-tag>
          </div>
        </div>
        <!-- Trường hiển thị -->
        <div class="py-2">
          <label>Hiển thị</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagVisibilityColor" class="font-bold">{{
              displayVisibility
            }}</a-tag>
          </div>
        </div>
      </div>

      <!-- Thông tin mô tả -->
      <div class="block bg-white rounded-xl">
        <div class="py-2">
          <span class="font-bold text-base">Thông tin mô tả</span>
        </div>
        <div class="py-2">
          <label>Tiêu đề </label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="formData.title"
              type="text"
              placeholder="Nhập tiêu đề"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="py-2">
          <span class="block">Nội dung mô tả </span>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <textarea
              v-model="formData.content"
              placeholder="Nhập nội dung mô tả"
              rows="4"
              class="w-full p-2 mt-1 border-none outline-none rounded-lg bg-gray-50"
              readonly
            ></textarea>
          </div>
        </div>
        <div class="py-2">
          <label>Giá cho thuê </label>
          <div class="flex border border-gray-300 rounded-lg mt-1 w-120">
            <input
              v-model.number="formData.accomodation.price"
              type="number"
              placeholder="VD: 1000000 (cho 1 triệu)"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/tháng</span>
          </div>
          <small class="text-gray-500">
            Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000
          </small>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Diện tích </label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.accomodation.acreage"
              type="number"
              placeholder="Nhập diện tích"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">m²</span>
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Giá điện </label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.accomodation.electricPrice"
              type="number"
              placeholder="VD: 3500"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/kWh</span>
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Giá nước </label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model.number="formData.accomodation.waterPrice"
              type="number"
              placeholder="VD: 30000"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
            <span class="p-2 border-l border-gray-300">đồng/m³</span>
          </div>
        </div>
      </div>

      <!-- Giới tính (chỉ áp dụng khi Motel là O_GHEP) -->
      <div
        v-if="formData.accomodation.motel === 'O_GHEP'"
        class="block bg-white rounded-xl"
      >
        <div class="py-2">
          <span class="font-bold text-base">Giới tính</span>
        </div>
        <label>Giới tính yêu cầu</label>
        <div class="flex border border-gray-300 rounded-lg mt-1">
          <input
            v-model="displayGender"
            type="text"
            placeholder="Chọn giới tính"
            class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
            disabled
          />
        </div>
      </div>

      <!-- Khu vực -->
      <div class="block bg-white rounded-xl">
        <div class="py-2">
          <span class="font-bold text-base">Khu vực</span>
        </div>
        <div class="py-2">
          <label>Khu vực </label>
          <div class="flex border border-gray-300 rounded-lg mt-1">
            <input
              v-model="displayDistrict"
              type="text"
              placeholder="Chọn khu vực"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="py-2">
          <label class="block text-gray-700">Địa chỉ </label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-120"
          >
            <input
              v-model="formData.accomodation.address"
              type="text"
              placeholder="VD: Số 12, Ngõ 34..."
              class="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
        <div class="map-wrapper py-2">
          <label class="block text-gray-700">Bản đồ</label>
          <div class="flex items-center border border-gray-300 rounded-lg mt-1">
            <iframe
              width="100%"
              height="300"
              class="border-0"
              :src="`https://www.google.com/maps?q=${encodeURIComponent(
                displayMapAddress
              )}&output=embed`"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Đặc điểm nổi bật -->
      <div class="block bg-white rounded-xl">
        <h3 class="text-xl font-semibold">Đặc điểm nổi bật</h3>
        <div class="grid grid-cols-2 gap-y-3">
          <div
            v-for="(feature, idx) in featureOptions"
            :key="idx"
            class="flex items-center p-2 rounded-lg"
            :class="{ 'text-teal-500': formData.accomodation[feature.value] }"
          >
            <div class="relative">
              <input
                type="checkbox"
                class="hidden"
                :checked="formData.accomodation[feature.value]"
                readonly
              />
              <div
                class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
                :class="{
                  'bg-teal-500 border-teal-500':
                    formData.accomodation[feature.value],
                }"
              >
                <CheckIcon
                  v-if="formData.accomodation[feature.value]"
                  class="w-3 h-3 text-white"
                />
              </div>
            </div>
            <span class="ml-2 text-sm">{{ feature.label }}</span>
          </div>
        </div>
      </div>

      <!-- Các nút hành động -->
      <div class="pt-10" v-if="displayStatus === 'Chờ duyệt'">
        <div class="flex space-x-5">
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleBlock"
              class="px-3 py-2 bg-red-500 text-white rounded-lg w-full"
            >
              Khóa bài
            </button>
          </div>
          <div class="flex-1 text-white font-semibold">
            <button
              @click="handleApprove"
              class="px-3 py-2 bg-green-500 text-white rounded-lg w-full"
            >
              Duyệt bài
            </button>
          </div>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Đã duyệt'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleBlock"
            class="w-full px-3 py-2 bg-red-500 text-white rounded-lg"
          >
            Khóa bài
          </button>
        </div>
      </div>
      <div class="pt-10" v-else-if="displayStatus === 'Bị khóa'">
        <div class="flex text-white font-semibold">
          <button
            @click="handleApprove"
            class="w-full px-3 py-2 bg-green-500 text-white rounded-lg"
          >
            Mở khóa
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  defineProps,
  defineEmits,
} from "vue";
import { Modal, message, Tag } from "ant-design-vue";
import { Check as CheckIcon } from "lucide-vue-next";
import { getDetailPost, approvePost } from "@/apis/postService.js";

const props = defineProps({
  open: { type: Boolean, default: false },
  postId: { type: [String, Number], default: "" },
});
const emit = defineEmits(["update:open"]);

const modalVisible = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Dữ liệu form với các trường approved, notApproved, del nằm ngoài accomodation
const formData = reactive({
  title: "",
  content: "",
  approved: false,
  notApproved: false,
  del: false,
  accomodation: {
    motel: "",
    price: 0,
    acreage: 0,
    electricPrice: 0,
    waterPrice: 0,
    gender: null,
    address: "",
    idDistrict: "",
    // Đặc điểm nổi bật
    interior: false,
    airConditioner: false,
    heater: false,
    internet: false,
    toilet: false,
    time: false,
    parking: false,
    security: false,
    owner: false,
    kitchen: false,
  },
});

// Danh sách khu vực
const districtList = ref([
  { id: 1, name: "An Đào" },
  { id: 4, name: "Đào Nguyên" },
  { id: 5, name: "Cửu Việt" },
  { id: 6, name: "Thành Chung" },
  { id: 7, name: "Ngô Xuân Quảng" },
  { id: 8, name: "Vinhomes Ocean Park" },
  { id: 9, name: "Khác" },
]);

// Danh sách đặc điểm nổi bật
const featureOptions = ref([
  { label: "Đầy đủ nội thất", value: "interior" },
  { label: "Có điều hòa", value: "airConditioner" },
  { label: "Có nóng lạnh", value: "heater" },
  { label: "Có internet", value: "internet" },
  { label: "Vệ sinh khép kín", value: "toilet" },
  { label: "Giờ giấc tự do", value: "time" },
  { label: "Có chỗ để xe", value: "parking" },
  { label: "An ninh tốt", value: "security" },
  { label: "Không chung chủ", value: "owner" },
  { label: "Kệ bếp", value: "kitchen" },
]);

// Bản đồ
const mapAddress = ref("");
const addressTimer = ref(null);
const loading = ref(false);
const displayMapAddress = computed(() => mapAddress.value.trim() || "VNUA");

watch(
  () => formData.accomodation.address,
  (newAddress) => {
    if (addressTimer.value) clearTimeout(addressTimer.value);
    addressTimer.value = setTimeout(() => {
      mapAddress.value = newAddress;
    }, 1000);
  }
);

// Computed property hiển thị Hình thức (văn bản bold, màu xanh lá nếu "Tìm phòng trọ", đỏ nếu "Tìm người ở ghép")
const displayMotel = computed(() => {
  if (formData.accomodation.motel === "PHONG_TRO") return "Tìm phòng trọ";
  if (formData.accomodation.motel === "O_GHEP") return "Tìm người ở ghép";
  return formData.accomodation.motel;
});

// Computed property hiển thị Giới tính
const displayGender = computed(() => {
  if (formData.accomodation.gender === true) return "Nam";
  if (formData.accomodation.gender === false) return "Nữ";
  return "Không yêu cầu";
});

// Computed property hiển thị Khu vực
const displayDistrict = computed(() => {
  const district = districtList.value.find(
    (d) => d.id === formData.accomodation.idDistrict
  );
  return district ? district.name : "";
});

// Computed property cho trạng thái:
// Nếu approved=true và notApproved=false: "Đã duyệt"
// Nếu approved=true và notApproved=true: "Chờ duyệt"
// Nếu approved=false: "Bị khóa"
const displayStatus = computed(() => {
  if (formData.approved === true && formData.notApproved === false) {
    return "Đã duyệt";
  } else if (formData.approved === true && formData.notApproved === true) {
    return "Chờ duyệt";
  } else if (formData.approved === false) {
    return "Bị khóa";
  }
  return "";
});

// Computed property cho hiển thị: nếu del=false: "Hiển thị", nếu del=true: "Bị ẩn"
const displayVisibility = computed(() => {
  return formData.del ? "Bị ẩn" : "Hiển thị";
});

// Computed property định nghĩa màu chữ cho Hình thức
const motelColor = computed(() => {
  if (formData.accomodation.motel === "PHONG_TRO") return "text-green-500";
  if (formData.accomodation.motel === "O_GHEP") return "text-red-500";
  return "";
});

// Computed property định nghĩa màu cho Trạng thái (Tag của antd)
const tagStatusColor = computed(() => {
  if (displayStatus.value === "Đã duyệt") return "green";
  if (displayStatus.value === "Chờ duyệt") return "gold";
  if (displayStatus.value === "Bị khóa") return "red";
  return "";
});

// Computed property định nghĩa màu cho Hiển thị (Tag của antd)
const tagVisibilityColor = computed(() => {
  if (displayVisibility.value === "Hiển thị") return "green";
  if (displayVisibility.value === "Bị ẩn") return "red";
  return "";
});

// Hàm duyệt bài (approve=true) và khóa bài (approve=false)
const handleApprove = async () => {
  try {
    await approvePost(props.postId, true);
    message.success("Bài đăng đã được duyệt");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi duyệt bài:", error);
    message.error("Lỗi duyệt bài");
  }
};

const handleBlock = async () => {
  try {
    await approvePost(props.postId, false);
    message.success("Bài đăng đã bị khóa");
    fetchPostDetails(props.postId);
  } catch (error) {
    console.error("Lỗi khóa bài:", error);
    message.error("Lỗi khóa bài");
  }
};

// Hàm lấy chi tiết bài đăng
const fetchPostDetails = async (id) => {
  console.log("Fetching post details for postId:", id);
  try {
    const response = await getDetailPost(id);
    const data = response.data || {};
    formData.title = data.title || "";
    formData.content = data.content || "";
    // API trả về các trường approved, notApproved, del ngoài accomodationDTO
    formData.approved = data.approved ?? false;
    formData.notApproved = data.notApproved ?? false;
    formData.del = data.del ?? false;
    if (data.accomodationDTO) {
      Object.assign(formData.accomodation, data.accomodationDTO);
      if (data.accomodationDTO.district && data.accomodationDTO.district.id) {
        formData.accomodation.idDistrict = data.accomodationDTO.district.id;
      }
    }
  } catch (error) {
    console.error("Lỗi tải thông tin bài đăng:", error);
    message.error("Không thể tải thông tin bài đăng.");
  }
};

// Gọi API khi component mount
onMounted(() => {
  if (props.postId) {
    fetchPostDetails(props.postId);
  }
});

// Watch để tự động fetch khi postId thay đổi
watch(
  () => props.postId,
  (newPostId, oldPostId) => {
    if (newPostId && newPostId !== oldPostId) {
      fetchPostDetails(newPostId);
    }
  }
);

const handleClose = () => {
  modalVisible.value = false;
};
</script>

<style scoped>
.submit-btn:hover {
  background-color: #2980b9;
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
