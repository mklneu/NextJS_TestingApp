"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";
import { FaPills, FaPlus, FaTrash } from "react-icons/fa";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

const CreatePrescriptionPage = () => {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.appointmentId;

  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: "", dosage: "", frequency: "", instructions: "" },
  ]);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMedicineChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newMedicines = [...medicines];
    newMedicines[index] = { ...newMedicines[index], [name]: value };
    setMedicines(newMedicines);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: Date.now(), // Dùng timestamp để đảm bảo key là duy nhất
        name: "",
        dosage: "",
        frequency: "",
        instructions: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length <= 1) {
      toast.info("Đơn thuốc phải có ít nhất một loại thuốc.");
      return;
    }
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = medicines.every(
      (med) => med.name && med.dosage && med.frequency
    );
    if (!isValid) {
      toast.error("Vui lòng điền đầy đủ thông tin cho tất cả các loại thuốc.");
      return;
    }

    setLoading(true);
    const payload = {
      appointmentId,
      medicines,
      doctorNotes,
    };
    console.log("Submitting prescription:", payload);

    // TODO: Gọi API để tạo đơn thuốc
    // try {
    //   await createPrescription(payload);
    //   toast.success("Tạo đơn thuốc thành công!");
    //   router.back();
    // } catch (error) {
    //   toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    // } finally {
    //   setLoading(false);
    // }

    // Giả lập API call
    setTimeout(() => {
      toast.success("Tạo đơn thuốc thành công!");
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 cursor-pointer
           text-gray-600 hover:text-gray-900
            font-semibold mb-6 transition-colors duration-200 focus:outline-none"
        >
          <IoIosArrowBack size={20} />
          Quay lại trang lịch hẹn
        </button>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 flex items-center gap-3">
            <FaPills />
            Tạo đơn thuốc
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Danh sách thuốc */}
            <div className="space-y-6">
              {medicines.map((med, index) => (
                <div
                  key={med.id}
                  className="p-4 border rounded-lg relative space-y-4 bg-gray-50/50"
                >
                  <p className="font-semibold text-gray-700">
                    Thuốc #{index + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, e)}
                      placeholder="Tên thuốc"
                      className="bg-white border outline-none
                       border-gray-300 text-gray-900 
                       text-sm rounded-lg focus:ring-blue-500
                        focus:border-blue-500 block w-full p-2.5 
                        placeholder:text-gray-400"
                      required
                    />
                    <input
                      type="text"
                      name="dosage"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, e)}
                      placeholder="Liều lượng (ví dụ: 500mg)"
                      className="bg-white border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="frequency"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Tần suất (ví dụ: 2 lần/ngày, sáng 1 viên, tối 1 viên)"
                    className="bg-white border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                    required
                  />
                  <input
                    type="text"
                    name="instructions"
                    value={med.instructions}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Hướng dẫn thêm (ví dụ: Uống sau khi ăn no)"
                    className="bg-white border border-gray-300 outline-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-gray-400"
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="absolute top-3 right-3 cursor-pointer
                       text-red-500 hover:text-red-700 p-1"
                      title="Xóa thuốc này"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Nút thêm thuốc */}
            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center gap-2 cursor-pointer
              text-blue-600 font-semibold hover:text-blue-800
               duration-200"
            >
              <FaPlus /> Thêm thuốc
            </button>

            {/* Lời dặn của bác sĩ */}
            <div>
              <label
                htmlFor="doctorNotes"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Lời dặn của bác sĩ
              </label>
              <textarea
                id="doctorNotes"
                rows={4}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                placeholder="Dặn dò thêm về chế độ ăn uống, sinh hoạt, lịch tái khám..."
              ></textarea>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm cursor-pointer
                font-medium text-gray-700 duration-300
                bg-gray-100 border border-gray-300
                 outline-none rounded-lg hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm cursor-pointer
                font-medium text-white bg-green-600 duration-300
                rounded-lg hover:bg-green-700 focus:ring-4
                 focus:outline-none focus:ring-green-300 disabled:bg-green-300"
              >
                {loading ? "Đang lưu..." : "Lưu đơn thuốc"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescriptionPage;
