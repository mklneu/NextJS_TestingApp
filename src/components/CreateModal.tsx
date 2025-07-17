import { useState } from "react";
import Button from "./Button";
import { toast } from "react-toastify";
import { getAllBlogs, postBlog } from "@/services/BlogServices";

interface ICreateModalProps {
  show?: boolean;
  setShow?: (value: boolean) => void;
  setBlogs?: (value: IBlog[]) => void;
  onSubmit?: () => void; // Callback function to handle submission
}

const CreateModal = (props: ICreateModalProps) => {
  const { show, setShow, setBlogs, onSubmit } = props;

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async () => {
    if (!title || !author || !content) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      await postBlog(title, author, content);

      // Refresh the blogs list
      onSubmit?.(); // Call the onSubmit callback if provided

      setTitle("");
      setAuthor("");
      setContent("");
      setShow?.(false); // Close modal after submission
    } catch (error) {
      console.error("Error creating blog:", error);
      // Error message đã được handle trong postBlog function
    }
  };

  const handleClose = () => {
    setTitle("");
    setAuthor("");
    setContent("");
    setShow?.(false); // Close modal
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
            <h1 className="px-5 py-4 text-2xl">Add New Modal</h1>
            <hr className="mb-6 text-gray-200" />
            <div className="input-box flex w-11/12 h-12 mb-4 mx-auto">
              <input
                type="text"
                placeholder="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-full bg-transparent rounded-xl pl-5 pr-14 placeholder:text-gray-700 border border-cyan-950 
                transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                focus:shadow-lg focus:shadow-blue-200/50
                hover:border-blue-300 hover:shadow-md
                placeholder-opacity-70 focus:placeholder-opacity-40"
              />
            </div>
            <div className="input-box flex w-11/12 h-12 relative mb-4 mx-auto">
              <input
                type="text"
                placeholder="Author"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full h-full bg-transparent rounded-xl pl-5 pr-14 placeholder:text-gray-700 border border-cyan-950
                transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                focus:shadow-lg focus:shadow-blue-200/50
                hover:border-blue-300 hover:shadow-md
                placeholder-opacity-70 focus:placeholder-opacity-40"
              />
            </div>
            <div className="input-box flex w-11/12 h-24 relative mb-4 mx-auto">
              <textarea
                placeholder="Content"
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-transparent rounded-xl pl-5 pr-5 pt-3 placeholder:text-gray-700 border border-cyan-950
                transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                focus:shadow-lg focus:shadow-blue-200/50
                hover:border-blue-300 hover:shadow-md
                placeholder-opacity-70 focus:placeholder-opacity-40 resize-none"
              />
            </div>
            <div className="flex justify-end mx-auto gap-2 mt-6 mb-8 w-11/12">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  handleClose();
                  toast.success("Modal closed");
                }}
              >
                Close
              </Button>
              <Button size="md" onClick={() => handleSubmit()}>
                Save
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CreateModal;
