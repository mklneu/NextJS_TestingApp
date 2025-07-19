import { useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import { postBlog } from "@/services/BlogServices";
import InputBar from "../Input";

interface IAddNewModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onSubmit: () => void; // Callback function to handle submission
}

const AddNewBlogModal = (props: IAddNewModalProps) => {
  const { show, setShow, onSubmit } = props;

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
      onSubmit(); // Call the onSubmit callback if provided

      setTitle("");
      setAuthor("");
      setContent("");
      setShow(false); // Close modal after submission
    } catch (error) {
      console.error("Error creating blog:", error);
      // Error message đã được handle trong postBlog function
    }
  };

  const handleClose = () => {
    setTitle("");
    setAuthor("");
    setContent("");
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
            <h1 className="px-5 py-4 text-2xl">Add New Blog</h1>
            <hr className="mb-6 text-gray-200" />
            <InputBar
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></InputBar>
            <InputBar
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            ></InputBar>
            <InputBar
              type="textarea"
              placeholder="Content"
              value={content}
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
              <Button size="md" onClick={() => handleSubmit()}>
                Add
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default AddNewBlogModal;
