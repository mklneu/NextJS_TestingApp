import { useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import { getBlogById } from "@/services/BlogServices";
import InputBar from "../Input";

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  blogId: number; // Optional blog ID for updating
  setBlogId: (value: number | null) => void; // Optional setter for blogId
}

const ViewBlogModal = (props: IUpdateModalProps) => {
  const { show, setShow, blogId, setBlogId } = props;

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Fetch the blog details if blogId is provided
    const fetchBlogDetails = async () => {
      if (blogId) {
        try {
          const blog = await getBlogById(blogId);
          setTitle(blog.title);
          setAuthor(blog.author);
          setContent(blog.content);
        } catch (error) {
          console.error("Error fetching blog details:", error);
          toast.error("Failed to fetch blog details.");
        }
      }
    };
    fetchBlogDetails();
  }, [blogId]);

  const handleClose = () => {
    setBlogId(null); // Reset blogId when closing the modal
    setShow(false); // Close modal
  };

  return (
    <>
      {show && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`flex justify-between bg-[rgba(0,0,0,0.4)] fixed
          items-center w-full min-h-screen mb-6 top-0 right-0 p-4 z-50`}
        >
          <div
            className="mx-auto bg-white text-black 
          rounded-lg shadow-2xl border border-gray-400
          w-196"
          >
            <h1 className="px-5 py-4 text-2xl">
              Blog Details{" "}
              <span className="text-gray-600 font-bold text-sm">
                no.{blogId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />
            <InputBar
              value={title}
              disabled={true}
              onChange={(e) => setTitle(e.target.value)}
            ></InputBar>
            <InputBar
              value={author}
              disabled={true}
              onChange={(e) => setAuthor(e.target.value)}
            ></InputBar>
            <InputBar
              type="textarea"
              value={content}
              disabled={true}
              onChange={(e) => setContent(e.target.value)}
            ></InputBar>
            <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default ViewBlogModal;
