import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import Button from "@/components/Button";

const getAllBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blogs");
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error in getAllBlogs:", error);
    toast.error("❌ Error while fetching blogs!");
    throw error; // Re-throw để component handle được
  }
};

const getBlogById = async (blogId: number) => {
  try {
    const response = await axiosInstance.get(`/blogs/${blogId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error in getBlogById:", error);
    toast.error("❌ Error while fetching blog by ID!");
    throw error; // Re-throw để component handle được
  }
};

const postBlog = async (title: string, author: string, content: string) => {
  try {
    // Uncomment dòng dưới khi có backend
    const response = await axiosInstance.post("/blogs", {
      title,
      author,
      content,
    });
    toast.success(`${title} by ${author} has been added successfully!`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error in postBlog:", error);
    toast.error("❌ Error while posting blog!");
    throw error; // Re-throw để component handle được
  }
};

const updateBlog = async (
  blogId: number,
  title: string,
  author: string,
  content: string
) => {
  try {
    const response = await axiosInstance.put(`/blogs/${blogId}`, {
      title,
      author,
      content,
    });
    toast.success(`${title} by ${author} has been updated successfully!`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("❌ Error in updateBlog:", error);
    toast.error("❌ Error while updating blog!");
    throw error; // Re-throw để component handle được
  }
};

const deleteBlogById = async (blogId: number, onDelete: () => void) => {
  // Custom confirm toast
  const confirmDelete = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col p-2 w-full">
          <div className="flex items-center mb-3">
            <span className="font-medium text-gray-800">
              Are you sure to delete this blog?
            </span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={async () => {
                closeToast();
                try {
                  await axiosInstance.delete(`/blogs/${blogId}`);
                  onDelete();
                  toast.success(`🗑️ Delete blog ${blogId} successfully!`);
                } catch (error) {
                  console.error("❌ Error in deleteBlog: ", error);
                  toast.error("❌ Error while deleting blog!");
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete
            </Button>
            <Button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        className: "custom-confirm-toast",
      }
    );
  };

  confirmDelete();
};

export { getAllBlogs, postBlog, getBlogById, updateBlog, deleteBlogById };
