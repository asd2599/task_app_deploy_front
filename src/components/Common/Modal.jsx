import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { closeModal } from "../../redux/slices/modalSlice";
import {
  fetchPostItem,
  fetchGetItem,
  fetchUpdateItem,
} from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";

const Modal = () => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const { modalType, task } = useSelector((state) => state.modal);

  const authData = useSelector((state) => state.auth.authData);
  const userKey = authData?.sub;

  const showModalContents = (modalType, update, detail, add) => {
    switch (modalType) {
      case "update":
        return update;
      case "detail":
        return detail;
      case "add":
        return add;
      default:
        return "";
    }
  };

  const modalTitle = showModalContents(
    modalType,
    "Update Task",
    "Detail Task",
    "Add Task",
  );

  const modalBtn = showModalContents(modalType, "Update", "", "Add Task");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    isCompleted: false,
    isImportant: false,
    userId: "",
    _id: "",
  });

  useEffect(() => {
    if (modalType === "detail" || modalType === "update") {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        isCompleted: task.iscompleted,
        isImportant: task.isimportant,
        userId: task.userId,
        _id: task._id,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        isCompleted: false,
        isImportant: false,
        userId: "",
        _id: "",
      });
    }
  }, [modalType, task]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userId: userKey,
    }));
  }, [userKey]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userKey) {
      toast.error("로그인이 필요한 서비스 입니다.");
      return;
    }

    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description) {
      toast.error("Description is required");
      return;
    }

    if (!formData.date) {
      toast.error("Date is required");
      return;
    }

    console.log(formData);
    console.log(modalType);

    try {
      if (modalType === "update") {
        await dispatch(fetchUpdateItem(formData)).unwrap();
        toast.success("Task Updated Successfully");
      } else {
        await dispatch(fetchPostItem(formData)).unwrap();
        toast.success("Task Created Successfully");
      }
    } catch (error) {
      console.log("Update Error:", error);
      toast.error("Error Post Item Data");
    }

    handleCloseModal();

    await dispatch(fetchGetItem(userKey)).unwrap();
  };

  const openModal = () => {
    dispatch(openModal());
  };

  return (
    <div className="modal fixed bg-black bg-opacity-50 w-full h-full left-0 top-0 z-50 flex justify-center items-center">
      <div className="form-wrapper bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className="text-2xl py-2 border-b border-gray-300 w-fit font-semibold">
          {modalTitle}
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="input-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              placeholder="Enter Title"
              onChange={handleChange}
              {...(modalType === "detail" && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              name="description"
              placeholder="Enter Description"
              onChange={handleChange}
              {...(modalType === "detail" && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              {...(modalType === "detail" && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="isCompleted">Is Completed</label>
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              {...(modalType === "detail" && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="isImportant">Is Important</label>
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
              {...(modalType === "detail" && { disabled: true })}
            />
          </div>

          <div className="submit-btn flex justify-end">
            <button
              type="submit"
              className={`flex justify-end bg-black py-3 px-6 rounded-md hover:bg-slate-900 ${
                modalType === "detail" ? "hidden" : ""
              }`}
            >
              {modalBtn}
            </button>
          </div>
        </form>

        <IoMdClose
          className="absolute top-10 right-10 text-2xl cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Modal;
