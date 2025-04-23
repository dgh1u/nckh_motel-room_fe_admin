<template>
  <a-modal
    v-model:open="modalVisible"
    :footer="null"
    @cancel="handleClose"
    width="800px"
  >
    <div class="create-post space-y-4">
      <!-- Tiêu đề tin đăng -->
      <div class="block flex items-center justify-center">
        <span class="font-bold text-3xl text-teal-500">Chi tiết tin đăng</span>
      </div>

      <!-- Thông tin Hình thức -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Hình thức</span>
        </div>
        <label> Loại hình <span class="text-red-500">*</span> </label>
        <div class="flex rounded-lg mt-1 p-2">
          <span class="font-bold" :class="motelColor">{{ displayMotel }}</span>
        </div>

        <!-- Phân loại -->
        <div class="py-2">
          <label>Phân loại</label>
          <div class="flex rounded-lg mt-1 p-2">
            <span class="font-bold">{{
              formData.accomodation.secondMotel
            }}</span>
          </div>
        </div>

        <!-- Trạng thái -->
        <div class="py-2">
          <label>Trạng thái</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagStatusColor" class="font-bold">{{
              displayStatus
            }}</a-tag>
          </div>
        </div>
        <!-- Hiển thị -->
        <div class="py-2">
          <label>Hiển thị</label>
          <div class="flex rounded-lg mt-1 p-2">
            <a-tag :color="tagVisibilityColor" class="font-bold">{{
              displayVisibility
            }}</a-tag>
          </div>
        </div>
      </div>

      <div class="py-2">
        <span class="font-bold text-base">Hình ảnh</span>
      </div>
      <!-- Gallery hình ảnh -->
      <div class="bg-white rounded-xl p-4 text-4xl shadow-lg">
        <div
          v-if="galleryImages.length > 0"
          class="relative w-full h-96 bg-black text-white flex items-center justify-center mb-4 rounded-xl"
        >
          <button
            class="absolute left-0 px-4 py-2 text-3xl"
            @click="prevImage"
            :disabled="galleryImages.length === 0"
          >
            &lt;
          </button>

          <img
            :src="galleryImages[currentImageIndex]"
            alt="gallery image"
            class="max-w-3xl max-h-full max-w-150 object-contain"
          />

          <button
            class="absolute right-0 px-4 py-2 text-3xl"
            @click="nextImage"
            :disabled="galleryImages.length === 0"
          >
            &gt;
          </button>
        </div>
        <!-- Hàng thumbnail, cuộn ngang -->
        <div
          class="flex space-x-2 overflow-x-auto mb-6 items-center justify-center"
        >
          <div
            v-for="(img, index) in galleryImages"
            :key="index"
            @click="currentImageIndex = index"
            class="cursor-pointer flex-shrink-0 w-20 h-20 border rounded"
            :class="{
              'border-blue-500': currentImageIndex === index,
              'border-gray-300': currentImageIndex !== index,
            }"
          >
            <img
              :src="img"
              alt="Thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin mô tả tin đăng -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Thông tin mô tả</span>
        </div>
        <div class="py-2">
          <label>Tiêu đề</label>
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
          <span class="block">Nội dung mô tả</span>
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
          <label class="block text-gray-700">Giờ làm việc</label>
          <div
            class="flex items-center border border-gray-300 rounded-lg mt-1 w-25"
          >
            <input
              v-model.number="formData.accomodation.openHours"
              type="text"
              placeholder="VD: 3500"
              class="w-full p-2 border-none outline-none rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
      </div>

      <!-- Thông tin Khu vực & Địa chỉ -->
      <div class="block bg-white rounded-xl p-4">
        <div class="py-2">
          <span class="font-bold text-base">Khu vực</span>
        </div>
        <div class="py-2">
          <label>Khu vực</label>
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
          <label class="block text-gray-700">Địa chỉ</label>
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
import { message } from "ant-design-vue";
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

// Biến chứa danh sách URL hình ảnh dạng gallery
const galleryImages = ref([]);

// Biến điều hướng ảnh
const currentImageIndex = ref(0);
const nextImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % galleryImages.value.length;
  }
};
const prevImage = () => {
  if (galleryImages.value.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + galleryImages.value.length) %
      galleryImages.value.length;
  }
};

// Dữ liệu form
const formData = reactive({
  title: "",
  content: "",
  approved: false,
  notApproved: false,
  del: false,
  accomodation: {
    motel: "",
    secondMotel: "",
    address: "",
    idDistrict: "",
    openHours: "",
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

// Bản đồ
const mapAddress = ref("");
const addressTimer = ref(null);
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

// Computed property hiển thị Hình thức
const displayMotel = computed(() => {
  if (formData.accomodation.motel === "CUA_HANG") return "Cửa hàng";
  if (formData.accomodation.motel === "TIEN_ICH") return "Tiện ích";
  return formData.accomodation.motel;
});

// Computed property hiển thị Khu vực
const displayDistrict = computed(() => {
  const district = districtList.value.find(
    (d) => d.id === formData.accomodation.idDistrict
  );
  return district ? district.name : "";
});

// Computed property cho trạng thái bài đăng
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
const displayVisibility = computed(() => (formData.del ? "Bị ẩn" : "Hiển thị"));

// Computed property định nghĩa màu chữ cho Hình thức
const motelColor = computed(() => {
  if (formData.accomodation.motel === "CUA_HANG") return "text-green-500";
  if (formData.accomodation.motel === "TIEN_ICH") return "text-red-500";
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

// Hàm duyệt bài
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

// Hàm khóa bài
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
  try {
    const response = await getDetailPost(id);
    const data = response.data || {};
    formData.title = data.title || "";
    formData.content = data.content || "";
    formData.approved = data.approved ?? false;
    formData.notApproved = data.notApproved ?? false;
    formData.del = data.del ?? false;
    if (data.accomodationDTO) {
      Object.assign(formData.accomodation, data.accomodationDTO);
      if (data.accomodationDTO.district && data.accomodationDTO.district.id) {
        formData.accomodation.idDistrict = data.accomodationDTO.district.id;
      }
    }
    // Nếu API trả về mảng hình ảnh thì cập nhật lại galleryImages
    if (data.imageStrings) {
      galleryImages.value = data.imageStrings;
      // Reset currentImageIndex về 0 nếu cần
      currentImageIndex.value = 0;
    }
  } catch (error) {
    console.error("Lỗi tải thông tin bài đăng:", error);
    message.error("Không thể tải thông tin bài đăng.");
  }
};

onMounted(() => {
  if (props.postId) {
    fetchPostDetails(props.postId);
  }
});

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
