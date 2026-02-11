import React, { useState } from "react";
import { MdEditDocument } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  fetchUpdateCompletedTask,
  fetchDeleteItem,
  fetchGetItem,
} from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { openModal } from "../../redux/slices/modalSlice";

const Item = ({ item }) => {
  const { _id, title, description, date, iscompleted, isimportant, userid } =
    item;
  const [isCompleted, setIsCompleted] = useState(iscompleted);

  const dispatch = useDispatch();

  const cutOverText = (text, maxLength, suffix) => {
    if (maxLength === 0 || maxLength === undefined) maxLength = 20;

    if (suffix === "" || suffix === undefined) suffix = "...";

    if (text.length > maxLength) {
      return text.slice(0, maxLength) + suffix;
    }
    return text;
  };

  const handleUpdateCompletedTask = async () => {
    // setIsCompleted(!isCompleted)을 호출하면 상태 업데이트가 비동기적으로 이루어지기 때문에, isCompleted의 값이 즉시 변경되지 않는다.
    // 따라서 updateCompletedData 객체를 생성할 때 isCompleted의 이전 값이 사용된다. 이로 인해 true/false가 한 단계씩 밀리게 된다.

    // 상태를 미리 업데이트 하여 반영된 값을 사용
    const newIsCompleted = !isCompleted;
    setIsCompleted(newIsCompleted);

    const updateCompletedKeys = {
      itemId: _id,
      isCompleted: newIsCompleted,
    };

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateCompletedKeys),
    };

    try {
      await dispatch(fetchUpdateCompletedTask(options)).unwrap();

      newIsCompleted
        ? toast.success("Update Completed Task")
        : toast.success("Update Incomplete Task");

      await dispatch(fetchGetItem(userid)).unwrap();
    } catch (error) {
      toast.error("Update Fail Task" + error.message);
    }
  };

  const handleDeleteTask = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirm) return;

    if (!_id) {
      toast.error("Delete Fail Task");
      return;
    }

    try {
      await dispatch(fetchDeleteItem(_id)).unwrap();
      toast.success("Delete Task");
      await dispatch(fetchGetItem(userid)).unwrap();
    } catch (error) {
      toast.error("Delete Fail Task" + error.message);
    }
  };

  const handleDetailOpen = () => {
    dispatch(openModal({ modalType: "detail", task: item }));
  };

  const handleUpdateTask = () => {
    dispatch(openModal({ modalType: "update", task: item }));
  };

  return (
    <div className="item w-1/3 h-[25vh] p-[0.25rem]">
      <div className="w-full h-full bg-gray-950 rounded-md border border-gray-500 flex py-3 px-4 flex-col justify-between">
        <div className="upper">
          <h2 className="text-xl font-normal mb-3 relative pb-2 flex justify-between border-b">
            <span>{title}</span>
            <span
              className="text-sm font-normal py-1 px-3 border border-gray-500 rounded-sm hover:bg-gray-700 cursor-pointer"
              onClick={handleDetailOpen}
            >
              Detail
            </span>
          </h2>
          <p>{cutOverText(description)}</p>
        </div>
        <div className="lower"></div>
        <p className="text-sm text-gray-400 mb-1">{date}</p>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className={`block py-1 px-3 text-sm text-white rounded-md ${iscompleted ? "bg-green-600" : "bg-gray-500"}`}
              onClick={() => handleUpdateCompletedTask()}
            >
              {iscompleted ? "Completed" : "Incomplete"}
            </button>
            <button
              className={`block py-1 px-3 text-sm text-white rounded-md ${isimportant ? "bg-red-500" : "bg-gray-500"}`}
            >
              Important
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleUpdateTask()}>
              <MdEditDocument className="w-7 h-7" />
            </button>
            <button onClick={() => handleDeleteTask()}>
              <FaTrash className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
