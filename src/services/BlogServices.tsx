import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";

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

// const 

export { getAllBlogs, postBlog };
