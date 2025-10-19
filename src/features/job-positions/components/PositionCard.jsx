export default function PositionCard({ position, onClicked,onClickedCandidates }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-[#E7F6EC] text-[#12B76A] border border-[#12B76A]";
      case "draft":
        return "bg-[#EFF4FF] text-[#3E63DD] border border-[#3E63DD]";
      case "closed":
        return "bg-[#FEE4E2] text-[#F04438] border border-[#F04438]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className={`bg-white rounded-[10px] p-4 border 
        transition-colors cursor-pointer relative
        border-gray-200 hover:border-gray-300
      `}
      onClick={onClicked}
    >
      <div className="absolute top-2 right-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
            position.status
          )}`}
        >
          {position.status}
        </span>
      </div>
      <>
        <div className="text-xs text-gray-500 mb-2">ID: {position.id}</div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {position.title}
            </h3>
            <p className="text-sm text-gray-500">{position.department}</p>
          </div>
          {/* <Dropdown
          menu={getDropdownItems(position)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            className="text-gray-400 hover:text-gray-600 p-1 bg-white action-button"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreOutlined />
          </button>
        </Dropdown> */}
        </div>

        {/* Level and Experience */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            {/* <BarChartOutlined className="text-gray-400" /> */}
            <span className="text-sm text-gray-600">{position.level}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* <RiseOutlined className="text-gray-400" /> */}
            <span className="text-sm text-gray-600">{position.experience}</span>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
            {position.type}
          </span>
          <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
            {position.mode}
          </span>
        </div>

        {/* Salary and Applicants */}
        <div className="flex flex-col gap-2">
          <div className="text-[#7B61FF] font-medium">{position.salary}</div>
          <div
            className="text-sm text-gray-500 cursor-pointer hover:text-[#7B61FF] applicants-count flex items-center gap-1"
            onClick={onClickedCandidates}
          >
            {/* <UserOutlined className="text-gray-400" /> */}
            {position.applicants} ứng viên
          </div>
        </div>
      </>
    </div>
  );
}
