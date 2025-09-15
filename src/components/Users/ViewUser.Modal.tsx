import { useEffect, useState } from "react";
import Button from "../Button";
import { toast } from "react-toastify";
import InputBar from "../Input";
import { getUserById } from "@/services/UserServices";

interface IUpdateModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  userId: number; // Optional blog ID for updating
  setUserId: (value: number | null) => void; // Optional setter for blogId
}

const ViewUserModal = (props: IUpdateModalProps) => {
  const { show, setShow, userId, setUserId } = props;

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Fetch the blog details if blogId is provided
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const user = await getUserById(userId);
          setUserName(user.username);
          setEmail(user.email);
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Failed to fetch user details.");
        }
      }
    };
    fetchUserDetails();
  }, [userId]);

  const handleClose = () => {
    setUserId(null); // Reset blogId when closing the modal
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
              User Details{" "}
              <span className="text-gray-600 font-bold text-sm">
                no.{userId}
              </span>
            </h1>
            <hr className="mb-6 text-gray-200" />
            <InputBar
              value={userName}
              disabled={true}
              onChange={(e) => setUserName(e.target.value)}
            ></InputBar>
            <InputBar
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
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

export default ViewUserModal;
