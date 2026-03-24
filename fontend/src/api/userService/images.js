import apiClient from "../apiClient";

const BASE_URL = "/images";

const imageService = {
  // Update user images - handles both adding new images and deleting existing ones
  updateUserImages: (updateUserImagesDTO) => {
    console.log("🌐🌐🌐 API SERVICE: UPDATE USER IMAGES");
    console.log("📡 URL: PUT /user/update-image");
    console.log("📋 UpdateUserImagesDTO:", updateUserImagesDTO);
    console.log(
      "📋 New Images Count:",
      updateUserImagesDTO.newImages?.length || 0
    );
    console.log(
      "📋 Deleted Images Count:",
      updateUserImagesDTO.deletedImages?.length || 0
    );

    return apiClient.put(`${BASE_URL}/update-image`, updateUserImagesDTO);
  },
};

export default imageService;
