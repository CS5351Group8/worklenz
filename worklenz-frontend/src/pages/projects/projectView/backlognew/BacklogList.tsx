// import ImprovedTaskFilters from "../task-management/improved-task-filters";
import BacklogListTable from "./BacklogListTable";

const BacklogList: React.FC = () => {

  return (
    <div>
      {/* Task Filters */}
      {/* <div className="flex-none" style={{ height: '54px', flexShrink: 0 }}>
        <ImprovedTaskFilters position="list" />
      </div> */}
      <BacklogListTable />
    </div>
  );
};

export default BacklogList;
