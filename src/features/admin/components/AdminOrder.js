import React, { useEffect, useState } from 'react'
import { ITEMS_PER_PAGE, discountPrice } from '../../../app/constant'
import { fetchAllOrdersAsync, selectOrders, selectTotalOrders, updateOrderAsync } from '../../order/orderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { XMarkIcon, EyeIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import Pagination from '../../common/Pagination'

const AdminOrder = () => {
    const [page, setPage] = useState(1)
    const dispatch = useDispatch()
    const orders = useSelector(selectOrders)
    const totalOrders = useSelector(selectTotalOrders)
    const [editableOrder, setEditableOrder] = useState(-1)
    const [sort, setSort] = useState({})
    const handleEdit = (item) => {
        setEditableOrder(item.id)
    }
    const handleShow = () => {
        console.log("show details")
    }
    const handleOrderStatus = (e, order) => {
        const updateOrder = { ...order, status: e.target.value }
        dispatch(updateOrderAsync(updateOrder))
        setEditableOrder(-1)
    }

    const changeColor = (status) => {
        if (status === 'pending') {
            return 'bg-purple-200 text-purple-600'
        }
        else if (status === 'dispatched') {
            return 'bg-yellow-200 text-yellow-600'
        }
        else if (status === 'delivered') {
            return 'bg-green-200 text-green-600'
        }
        else if (status === 'cancelled') {
            return 'bg-red-200 text-red-600'
        }
        else {
            return 'bg-purple-200 text-purple-600'
        }
    }

    const handlePage = (page) => {
        setPage(page)
    }

    // sort
    const handleSort = (sortOption) => {
        const sort = { _sort: sortOption.sort, _order: sortOption.order };
        console.log({ sort });
        setSort(sort);
    };
    useEffect(() => {
        const pagination = { _page: page, _limit: ITEMS_PER_PAGE }
        dispatch(fetchAllOrdersAsync({ sort, pagination }))
    }, [dispatch, page, sort])


    return (
        <>
            <div className="overflow-x-auto">
                <div className=" flex items-center justify-center bg-gray-100 font-sans overflow-hidden">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded my-6">
                            <table className="min-w-max w-full table-auto">
                                <thead>
                                    <tr>
                                        <th
                                            className="py-3 px-6 text-left cursor-pointer"
                                            onClick={(e) =>
                                                handleSort({
                                                    sort: 'id',
                                                    order: sort?._order === 'asc' ? 'desc' : 'asc',
                                                })
                                            }
                                        >
                                            Order# {' '}
                                            {sort._sort === 'id' &&
                                                (sort._order === 'asc' ? (
                                                    <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                                ) : (
                                                    <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                                ))}
                                        </th>

                                        <th className="py-3 px-6 text-left">Items</th>

                                        <th
                                            className="py-3 px-6 text-left cursor-pointer"
                                            onClick={(e) =>
                                                handleSort({
                                                    sort: 'totalAmount',
                                                    order: sort?._order === 'asc' ? 'desc' : 'asc',
                                                })
                                            }
                                        >
                                            Total Amount {' '}
                                            {sort._sort === 'totalAmount' &&
                                                (sort._order === 'asc' ? (
                                                    <ArrowUpIcon className="w-4 h-4 inline"></ArrowUpIcon>
                                                ) : (
                                                    <ArrowDownIcon className="w-4 h-4 inline"></ArrowDownIcon>
                                                ))}
                                        </th>
                                        <th className="py-3 px-6 text-center">Shipping Address</th>
                                        <th className="py-3 px-6 text-center">Status</th>
                                        <th className="py-3 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {orders.map(order => <tr className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="mr-2">
                                                </div>
                                                <span className="font-medium">{order.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            {order.items.map(item => <div className="flex p-4 items-center">
                                                <div className="mr-2">
                                                    <img
                                                        className="w-6 h-6 rounded-full"
                                                        src={item.thumbnail}
                                                    />
                                                </div>
                                                <span>{item.title} - #{item.quantity} - ${discountPrice(item)}</span>
                                            </div>)}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center">
                                                ${order.totalAmount}
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {order.selectedAddres && <div className="">
                                                <div>
                                                    <strong>{order.selectedAddres.name}</strong>,
                                                </div>
                                                <div>{order.selectedAddres.street},</div>
                                                <div>{order.selectedAddres.city}, </div>
                                                <div>{order.selectedAddres.state}, </div>
                                                <div>{order.selectedAddres.pinCode}, </div>
                                                <div>{order.selectedAddres.phone}, </div>
                                            </div>}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {order.id === editableOrder ? (
                                                <select onChange={e => handleOrderStatus(e, order)}>
                                                    <option value="pending">Pending</option>
                                                    <option value="dispatched">Dispatched</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>) :
                                                (<span className={`bg-purple-200 ${changeColor(order.status)} py-1 px-3 rounded-full text-xs`}>
                                                    {order.status}
                                                </span>)}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex item-center justify-center">
                                                <div className="w-4 mr-5 transform hover:text-purple-500 hover:scale-110">
                                                    <EyeIcon className="w-5 h-5" onClick={e => handleShow()}></EyeIcon>
                                                </div>
                                                <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                                    <PencilIcon className="w-5 h-5" onClick={e => handleEdit(order)}></PencilIcon>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Pagination page={page} setPage={setPage} handlePage={handlePage} totalItems={totalOrders}></Pagination>

            </div >
        </>


    )
}

export default AdminOrder