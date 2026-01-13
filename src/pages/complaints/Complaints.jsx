import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { filterValue, loading, complaintsData, paginationData, deleteComplaint } from 'store/reducers/complaintsSlide';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/complaints/Columns';
import CircularLoader from 'components/common/loader/CircularLoader';
import ComplaintsButtonsOnTable from 'components/pages/complaints/ComplaintsButtonsOnTable';
import BasicTabs from 'sections/components-overview/tabs/BasicTabs';


export default function Complaints() {
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});

  const getComplaintData = async (values = {}) => {
    setIsLoading(true);
    const query = {
      complaint_number: values?.complaint_number || '',
      priority: values?.priority || '',
      status: values?.status || '',
      page: 1,
      per_page: pageSize
    };
    setFilters(query);
    setPage(1)
    try {
      const response = await fetcher([
        "/get-assigned-complaints",
        { params: query }
      ]);
      if (response.status === true) {
        dispatch(complaintsData(response.data.data));
        dispatch(filterValue(values));
        dispatch(paginationData(response.data));
        setIsLoading(false);
      }
    }
    catch (error) { }
    finally {
      setIsLoading(false);
    }
  };
  const handleChangePerPage = async (event) => {
    const per_page = Number(event.target.value);
    setPageSize(per_page);
    setPage(1);

    const response = await fetcher([
      "/get-assigned-complaints",
      { params: { ...filters, page: 1, per_page } }
    ]);

    if (response.status === true) {
      dispatch(complaintsData(response.data.data));
      dispatch(paginationData(response.data));
    }
  };
  const handleChangePagination = async (event, value) => {
    setPage(value);

    const response = await fetcher([
      "/get-assigned-complaints",
      { params: { ...filters, page: value, per_page: pageSize } }
    ]);
    if (response.status === true) {
      dispatch(complaintsData(response.data.data));
      dispatch(paginationData(response.data));
    }
  };

  const handleDeleteComplaint = async (id) => {
    dispatch(loading(true));
    const response = await fetcherDelete([`/delete-complaint/${id}`]);
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: response.message || 'Complaint deleted successfuly!',
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
      dispatch(deleteComplaint({ id }));
      dispatch(loading(false));
    }
  }
  const updateProvider = async (id, data) => {
    const response = await fetcherUpdate(`/patient/${id}`, JSON.stringify(data))
    if (response.status === 200) {
      openSnackbar({
        open: true,
        message: response.message || 'Complaint updated successfuly!',
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
    }
  }
  const complaintsState = useSelector(state => state?.complaints)
  const complaintsStateData = complaintsState.complaintsData;

  useEffect(() => {
    getComplaintData({}, page, pageSize);
  }, []);

  const tabsData = [
    {
      label: 'My Complaints',
      icon: '',
      content:
        isLoading ?
          <CircularLoader />
          :
          <CommonTable
            data={complaintsStateData.filter(item => item.raised_by_role === 'broker')}
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
    },
    {
      label: 'Other Complaints',
      icon: '',
      content:
        isLoading ?
          <CircularLoader />
          :
          <CommonTable
            data={complaintsStateData.filter(item => item.raised_by_role !== 'broker')}
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
    },
  ];
  return (
    <BasicTabs tabs={tabsData} />
  );
}