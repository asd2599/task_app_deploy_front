import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "./PageTitle";
import AddItem from "./AddItem";
import Modal from "./Modal";
import Item from "./Item";
import { fetchGetItem } from "../../redux/slices/apiSlice";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingSkeleton from "./LoadingSkeleton";

const ItemPanel = ({ pageTitle, filterCompleted, filterImportant }) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  //Auth Data
  const authData = useSelector((state) => state.auth.authData);
  const userKey = authData?.sub;

  const isOpen = useSelector((state) => state.modal.isOpen);

  //Get Item Data
  const getItemData = useSelector((state) => state.api.getItemData);

  useEffect(() => {
    if (!userKey) return;

    const fetchGetItemsData = async () => {
      try {
        setIsLoading(true);
        await dispatch(fetchGetItem(userKey)).unwrap();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGetItemsData();
  }, [dispatch, userKey]);

  const fillteredTasks = getItemData
    ?.filter((task) => {
      if (filterCompleted === "all") return true;
      return filterCompleted ? task.iscompleted : !task.iscompleted;
    })
    .filter((task) => {
      if (filterImportant === "all") return true;
      return filterImportant ? task.isimportant : !task.isimportant;
    });

  return (
    <div className="panel bg-[#212121] w-4/5 h-full rounded-md border border-gray-500 py-5 px-4 overflow-y-auto">
      {userKey ? (
        <div className="w-full h-full">
          {isOpen && <Modal />}
          <PageTitle title={pageTitle} />
          <div className="flex flex-wrap">
            {isLoading ? (
              <SkeletonTheme
                baseColor="#202020"
                highlightColor="#444"
                height="25vh"
              >
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </SkeletonTheme>
            ) : (
              fillteredTasks?.map((item, idx) => <Item key={idx} item={item} />)
            )}
            <AddItem />
          </div>
        </div>
      ) : (
        <div className="login-massage w-full h-full flex items-center justify-center">
          <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-2 px-4 rounded-md">
            <span className="text-sm font-semibold">
              로그인이 필요한 서비스 입니다.
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
// 1. home 메뉴를 서택할 때:
// - all메뉴를 선택하면 첫번째 filter 조건이 true이므로 모든 task를 반환
// - 1번에서 반환된 모든 tasks를 대상으로 두번째 filter 조건을 적용
// - filterImportant가 undefined이면 조건이 true 이므로 모든 task를 반환

// 2. Completed 메뉴를 선택할 때:
// - 첫번째 필터 조건에서 if문이 false이므로 return 문으로 이동하여 filterCompleted 조건을 판단
// - filterCompleted가 true이면 task.iscompleled가 true인 task만 반환

// 3. Proceeding 메뉴를 선택할 때:
// - 첫번째 필터 조건에서 if문이 false이므로 return 문으로 이동하여 filterCompleted 조건을 판단
// - filterCompleted가 false이면 task.iscompleled가 false인 task만 반환

// 4. Important 메뉴를 선택할 때:
// - 첫번째 필터 조건에서 if문이 true이므로 두번째 필터 조건으로 이동
// - 두번째 filter 조건에서 filterImportant가 없으면 true이므로 모든 task를 반환(home, Completed, Proceeding과 동일)
// - filterImportant가 true이면 task.isimportant가 true인 task만 반환
