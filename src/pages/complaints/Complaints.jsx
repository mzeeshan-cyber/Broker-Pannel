import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { filterValue, loading, complaintsData, paginationData, deleteComplaint } from 'store/reducers/complaintsSlide';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/complaints/Columns';
import CircularLoader from 'components/common/loader/CircularLoader';
import ComplaintsButtonsOnTable from 'components/pages/complaints/ComplaintsButtonsOnTable';
import ConmplaintsTabs from './ConmplaintsTabs';

export default function Complaints() {
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const dispatch = useDispatch();
  const complaintsState = useSelector(state => state?.complaints);
  const complaintsStateData = complaintsState.complaintsData;

  const getComplaintData = async (values = {}, tabIndex, resetPage = true) => {
    if (resetPage) setPage(1);

    setIsLoading(true);
    const query = {
      complaint_number: values?.complaint_number || '',
      priority: values?.priority || '',
      status: values?.status || '',
      raised_by_role: tabIndex === 0 ? 'broker' : 'other',
      page: resetPage ? 1 : page,
      per_page: pageSize
    };

    setFilters(query);

    try {
      const response = await fetcher(['/get-assigned-complaints', { params: query }]);
      if (response.status === true) {
        dispatch(complaintsData(response.data.data));
        dispatch(filterValue(values));
        dispatch(paginationData(response.data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);
    setPageSize(per_page);
    getComplaintData({}, activeTab);
  };

  const handleChangePagination = async (event, value) => {
    setPage(value);

    const query = {
      ...filters,
      page: value,
      per_page: pageSize,
      raised_by_role: activeTab === 0 ? 'broker' : 'other'
    };

    setIsLoading(true);
    try {
      const response = await fetcher(['/get-assigned-complaints', { params: query }]);
      if (response.status === true) {
        dispatch(complaintsData(response.data.data));
        dispatch(paginationData(response.data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/delete-complaint/${id}`]);
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: response.message || 'Complaint deleted successfully!',
        variant: 'alert',
        alert: { color: 'success' }
      });
      dispatch(deleteComplaint({ id }));
      dispatch(loading(false));
    }
  };

  const updateProvider = async (id, data) => {
    const response = await fetcherUpdate(`/patient/${id}`, JSON.stringify(data));
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: response.message || 'Complaint updated successfully!',
        variant: 'alert',
        alert: { color: 'success' }
      });
    }
  };

  useEffect(() => {
    getComplaintData({}, activeTab);
  }, []);

  const tableContent = (
    isLoading
      ? <CircularLoader />
      : <CommonTable
        data={complaintsStateData}
        paginationData={complaintsState?.paginationData}
        defaultColumns={columns}
        setPageSize={setPageSize}
        pageSize={pageSize}
        page={page}
        handleChangePerPage={handleChangePerPage}
        handleChangePagination={handleChangePagination}
        handleDelete={handleDeleteComplaint}
        handleUpdate={updateProvider}
        stackontable={<ComplaintsButtonsOnTable handleGetData={getComplaintData} filters={filters} />}
        tableName="complaints"
      />
  );

  const tabsData = [
    { label: 'My Complaints', icon: '', content: tableContent },
    { label: 'Other Complaints', icon: '', content: tableContent },
  ];

  return (
    <ConmplaintsTabs
      value={activeTab}
      onChange={(event, newValue) => {
        setActiveTab(newValue);
        getComplaintData({}, newValue);
      }}
      tabs={tabsData}
    />

  );
}
