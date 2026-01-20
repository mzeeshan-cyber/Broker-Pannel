import { openSnackbar } from 'api/snackbar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetcher, fetcherDelete, fetcherUpdate } from 'utils/axios';
import { filterValue, loading, standingOrderData, paginationData, deleteStandingOrder } from 'store/reducers/standingOrderSlice';
import CommonTable from 'pages/tables/react-table/common-table';
import { columns } from 'pages/tables/broker-tables/standing-orders/Columns';
import CircularLoader from 'components/common/loader/CircularLoader';
import ButtonsOnTable from 'components/pages/standing-orders/ButtonsOnTable';


export default function StandingOrders() {
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({});

    const getStandingOrdersData = async (values = {}) => {
        setIsLoading(true);
        const query = {
            mobility: values.mobility || '',
            patient: values.patient || '',
            status: values?.status || '',
            page: 1,
            per_page: pageSize
        };
        setFilters(query);
        setPage(1)
        try {
            const response = await fetcher([
                "/fetch-standing-order",
                { params: query }
            ]);
            if (response.status === true) {
                dispatch(standingOrderData(response.data.data));
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
            "/fetch-standing-order",
            { params: { ...filters, page: 1, per_page } }
        ]);

        if (response.status === true) {
            dispatch(standingOrderData(response.data.data));
            dispatch(paginationData(response.data));
        }
    };
    const handleChangePagination = async (event, value) => {
        setPage(value);

        const response = await fetcher([
            "/fetch-standing-order",
            { params: { ...filters, page: value, per_page: pageSize } }
        ]);
        if (response.status === true) {
            dispatch(standingOrderData(response.data.data));
            dispatch(paginationData(response.data));
        }
    };

    const handledeleteStandingOrder = async (id) => {
        dispatch(loading(true));
        const response = await fetcherDelete([`/delete-standing-order/${id}`]);
        if (response.status === 200) {
            openSnackbar({
                open: true,
                message: response.message || 'Standing Order deleted successfuly!',
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            });
            dispatch(deleteStandingOrder({ id }));
            dispatch(loading(false));
        }
    }
    const updateStandingOrder = async (id, data) => {
        const response = await fetcherUpdate(`/update-standing-order/${id}`, JSON.stringify(data))
        if (response.status === 200) {
            openSnackbar({
                open: true,
                message: response.message || 'Standing Order updated successfuly!',
                variant: 'alert',
                alert: {
                    color: 'success'
                }
            });
        }
    }
    const standingOrdersState = useSelector(state => state?.standingOrders)
    const standingOrdersStateData = standingOrdersState.standingOrderData;

    useEffect(() => {
        getStandingOrdersData({}, page, pageSize);
    }, []);

    return (
        isLoading ?
            <CircularLoader />
            :
            <CommonTable
                data={standingOrdersStateData || []}
                paginationData={standingOrdersState?.paginationData}
                defaultColumns={columns}
                setPageSize={setPageSize}
                pageSize={pageSize}
                page={page}
                handleChangePerPage={handleChangePerPage}
                handleChangePagination={handleChangePagination}
                handleDelete={handledeleteStandingOrder}
                handleUpdate={updateStandingOrder}
                stackontable={<ButtonsOnTable handleGetData={getStandingOrdersData} filters={filters} />}
                tableName="standing-orders"
            />
    );
}