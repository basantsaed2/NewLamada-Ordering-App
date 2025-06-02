// import React, { useEffect, useState } from 'react'
// import { useGet } from '../../../Hooks/useGet';
// import { LinkButton, LoaderLogin } from '../../../Components/Components';
// import EmptyOrdersIcon from '../../../assets/Icons/EmptyOrdersIcon';
// import { Link } from 'react-router-dom';
// import { MdAutoDelete } from 'react-icons/md';
// import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// import Warning from '../../../assets/Icons/WarningIcon';
// import { useChangeState } from '../../../Hooks/useChangeState';
// import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

// const UpComingOrders = () => {
//                   const { t, i18n } = useTranslation(); // <-- use i18n to change language

//   const { refetch: refetchOrders, loading: loadingOrders, data: dataOrders } = useGet({
//     url: 'https://Lamadafoodbcknd.food2go.online/customer/orders',
//   });
//   const { changeState: cancelOrder, loadingChange: loadingCancel, responseChange: responseCancel } = useChangeState();

//   const [orders, setOrders] = useState([]);
//   const [cancelledTime, setCancelledTime] = useState('');

//   const [openDeleteOrder, setOpenDeleteOrder] = useState(null);

//   useEffect(() => {
//     refetchOrders();
//   }, [refetchOrders, responseCancel]);

//   useEffect(() => {
//     if (dataOrders && dataOrders.orders) {
//       setCancelledTime(dataOrders.cancel_time);
//       setOrders(dataOrders.orders);
//     }

//   }, [dataOrders]);


//   const handleOpenDelete = (orderId) => {
//     setOpenDeleteOrder(orderId);
//   };

//   const handleCloseDelete = () => {
//     setOpenDeleteOrder(null);
//   };

//   // Cancelled Order
//   const handleCancelOrder = async (id, name, status) => {
//     const response = await cancelOrder(
//       `https://Lamadafoodbcknd.food2go.online/customer/orders/cancel/${id}`,
//       `${name} is Cancelled.`,
//       { status }
//     );

//     if (response) {
//       setCategories(openDeleteOrder(null));
//     }

//   };

//   return (
//     <>
//       {loadingOrders || loadingCancel ? (
//         <div className="flex items-center justify-center w-full h-full mt-16">
//           <LoaderLogin />
//         </div>
//       ) : (
//         <div className="w-full h-[65vh] overflow-y-scroll rounded-xl scrollPage px-1 pb-2 shadow-md flex flex-col items-center justify-start gap-2">
//           {orders.length === 0 ? (
//             <div className='mt-16'>
//               <EmptyOrdersIcon />
//               <span className='text-2xl font-TextFontRegular text-thirdColor'>{t("NoOdeOrders")}</span>
//               <span className='text-xl font-TextFontLight text-secoundColor'>{t("YouHaven'tMadeAnyPurchaseYet")}</span>
//               <div className="mt-8">
//                 <LinkButton
//                   text={'Explore Menu'}
//                   to={'/'}
//                 />
//               </div>
//             </div>
//           ) : (
//             <ul className='flex flex-col items-center justify-center w-full gap-5 text-xl shadow-sm font-TextFontLight text-secoundColor'>
//               {orders.map(order => (
//                 <li
//                   key={order.id}
//                   className='flex w-full pl-4 overflow-hidden bg-secoundBgColor rounded-xl'
//                 >
//                   {/* Deatils */}
//                   <div className="flex flex-col items-start justify-center w-6/12 gap-2 pt-4 pb-4">
//                     <span className='text-secoundColor sm:text-lg xl:text-xl font-TextFontRegular'>
//                       {order?.order_date} {new Date(order?.order_date + ' ' + order?.date).toLocaleTimeString('en-US', { hour12: true })}
//                     </span>
//                     <p className='text-secoundColor sm:text-lg xl:text-xl font-TextFontRegular'>{t("Order")} <span className='text-mainColor sm:text-xl xl:text-2xl font-TextFontMedium'>#{order?.id}</span> </p>
//                     <span className='text-secoundColor sm:text-lg xl:text-xl font-TextFontRegular'>{order?.amount} $</span>
//                     <span className='text-mainColor sm:text-lg xl:text-xl font-TextFontRegular'>{order?.payment_method?.name}</span>
//                   </div>
//                   {/* images */}
//                   <br />
//                   <div className="flex flex-col items-end justify-between w-6/12 gap-2">
//                     <div className="flex items-center justify-center gap-10">
//                       {((new Date().getTime() - new Date(order.order_date + 'T' + order.date).getTime()) <= (parseInt(cancelledTime.split(':')[0], 10) * 3600 * 1000) + (parseInt(cancelledTime.split(':')[1], 10) * 60 * 1000) + (parseInt(cancelledTime.split(':')[2], 10) * 1000)) && (
//                         <MdAutoDelete
//                           className='text-4xl cursor-pointer text-mainColor'
//                           onClick={() => handleOpenDelete(order.id)}
//                         />
//                       )}
//                       <span className='p-4 text-2xl text-white shadow-md bg-mainColor rounded-bl-xl font-TextFontRegular'>
//                         {order?.order_type?.replace('_', ' ').replace(/^./, c => c.toUpperCase())}
//                       </span>

//                       {openDeleteOrder === order.id && (
//                         <Dialog open={true} onClose={handleCloseDelete} className="relative z-10" aria-labelledby="dialog-title">
//                           <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
//                           <div className="fixed inset-0 z-10 overflow-y-auto">
//                             <div className="flex items-center justify-center min-h-screen">
//                               <DialogPanel className="relative bg-white shadow-xl rounded-2xl sm:w-10/12 sm:max-w-lg">
//                                 <div className="px-4 sm:p-6">
//                                   <Warning
//                                     // height="[5px]"
//                                     aria-hidden="true"
//                                   />
//                                   <div className="flex items-center justify-center">
//                                     <span className='text-secoundColor sm:text-lg xl:text-xl font-TextFontRegular'>
// {t("YouWillDeleteThisOrder")}                                    </span>
//                                   </div>
//                                 </div>
//                                 <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
//                                   <button className="inline-flex justify-center w-full px-6 py-3 text-sm text-white rounded-md shadow-sm bg-mainColor font-TextFontSemiBold sm:ml-3 sm:w-auto" onClick={() => handleCancelOrder(order.id, "Order", '')}>
//                                     {t("Delete")}
//                                   </button>

//                                   <button
//                                     type="button"
//                                     data-autofocus
//                                     onClick={handleCloseDelete}
//                                     className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm text-gray-900 bg-white rounded-md shadow-sm font-TextFontMedium ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
//                                   >
//                                     {t("Cancel")}
//                                   </button>
//                                 </div>
//                                 {/* <div className="px-4 pb-3 sm:flex sm:flex-row-reverse gap-x-4">
//                                   <button
//                                     type="button"
//                                     onClick={handleCloseDelete}
//                                     className="px-4 py-2 mt-3 text-sm bg-white border-2 rounded-md sm:mt-0 sm:w-auto border-secoundColor font-TextFontMedium text-secoundColor hover:bg-gray-50"
//                                   >
//                                     Close
//                                   </button>
//                                   <button
//                                     type="button"
//                                     onClick={() => handleCancelOrder(order.id)}
//                                     className="px-4 py-2 mt-3 text-sm text-white transition-all duration-300 border-2 rounded-md sm:mt-0 sm:w-auto border-mainColor font-TextFontMedium bg-mainColor hover:bg-white hover:text-mainColor"
//                                   >
//                                     Delete
//                                   </button>
//                                 </div> */}
//                               </DialogPanel>
//                             </div>
//                           </div>
//                         </Dialog>
//                       )}

//                     </div>
//                     <Link
//                       to={`order_traking/${order.id}`}
//                       className='flex items-center justify-center gap-2 text-secoundColor sm:text-lg xl:text-xl font-TextFontRegular'>
//                    {t("OrderTracking")} <span className='text-mainColor sm:text-lg xl:text-2xl font-TextFontMedium'>{'>>'}</span>
//                     </Link>
//                     <div className='flex items-center justify-center w-full gap-5 px-4 py-2 rounded-tl-xl bg-mainColor'>
//                       <img src="/src/assets/Images/OrderImg1.png" alt="order" />
//                       <img src="/src/assets/Images/OrderImg2.png" alt="order" />
//                       <img src="/src/assets/Images/OrderImg3.png" alt="order" />
//                     </div>
//                   </div>

//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </>
//   );
// };

// export default UpComingOrders;

import React, { useEffect, useState } from 'react';
import { useGet } from '../../../Hooks/useGet';
import { LinkButton, LoaderLogin } from '../../../Components/Components';
import EmptyOrdersIcon from '../../../assets/Icons/EmptyOrdersIcon';
import { Link } from 'react-router-dom';
import { MdAutoDelete } from 'react-icons/md';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Warning from '../../../assets/Icons/WarningIcon';
import { useChangeState } from '../../../Hooks/useChangeState';
import { useTranslation } from 'react-i18next';

const UpComingOrders = () => {
  const { t, i18n } = useTranslation();

  const { refetch: refetchOrders, loading: loadingOrders, data: dataOrders } = useGet({
    url: 'https://Lamadafoodbcknd.food2go.online/customer/orders',
  });
  const { changeState: cancelOrder, loadingChange: loadingCancel } = useChangeState();

  const [orders, setOrders] = useState([]);
  const [cancelledTime, setCancelledTime] = useState('');
  const [openCancelModal, setOpenCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  useEffect(() => {
    if (dataOrders && dataOrders.orders) {
      setCancelledTime(dataOrders.cancel_time);
      setOrders(dataOrders.orders);
    }
  }, [dataOrders]);

  const handleOpenCancelModal = (orderId) => setOpenCancelModal(orderId);
  const handleCloseCancelModal = () => {
    setOpenCancelModal(null);
    setCancelReason('');
  };

  const handleCancelOrder = async (id) => {
    await cancelOrder(
      `https://Lamadafoodbcknd.food2go.online/customer/orders/cancel/${id}`,
      `Order #${id} is Cancelled. Reason: ${cancelReason}`,
      { status: '', customer_cancel_reason: cancelReason }
    );
    handleCloseCancelModal();
    refetchOrders();
  };

  const isCancellable = (order) => {
    const currentTime = new Date('2025-05-21T11:21:00+03:00').getTime(); // Current time: 11:21 AM EEST
    const orderTime = new Date(`${order.order_date}T${order.date}`).getTime();
    const [hours, minutes] = cancelledTime.split(':').map(Number);
    const cancelWindow = (hours * 3600 + minutes * 60) * 1000; // Convert cancel_time to milliseconds
    return currentTime - orderTime <= cancelWindow;
  };

  const formatTime = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}`);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <>
      {loadingOrders || loadingCancel ? (
        <div className="flex items-center justify-center w-full h-full mt-16">
          <LoaderLogin />
        </div>
      ) : (
        <div className="w-full h-[65vh] overflow-y-scroll rounded-xl p-2 shadow-md">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16">
              <EmptyOrdersIcon />
              <span className="text-2xl font-TextFontRegular text-thirdColor">{t("NoOdeOrders")}</span>
              <span className="text-xl font-TextFontLight text-secoundColor">{t("YouHaven'tMadeAnyPurchaseYet")}</span>
              <div className="mt-8">
                <LinkButton text={t('ExploreMenu')} to="/" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">

                  {/* Order Number */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex gap-2 items-center">
                      <h3 className="text-lg font-TextFontMedium text-secoundColor">{t("Order#")}</h3>
                      <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">{order.id}</span>
                    </div>
                  </div>
                  {/* Order Status */}
                  <div className="px-4 py-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-TextFontMedium text-secoundColor">{t("OrderStatus")}</h3>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">{order.order_status}</span>
                    </div>
                    <p className="text-sm text-secoundColor">{t("OrderDate")}: {order.order_date} - {formatTime(order.order_date, order.date)}</p>
                  </div>

                  {/* Order Items */}
                  <div className="px-4 py-3">
                    <h3 className="text-lg font-TextFontMedium text-secoundColor">{t("OrderItems")}</h3>
                    {order.order_details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-1">
                        <div>
                          <p className="font-TextFontRegular">{detail.product[0].product.name}</p>
                          <span className="text-xs text-gray-500">x{detail.product[0].count}</span>
                        </div>
                        <span className="text-red-500 font-TextFontMedium">
                          {detail.product[0].product.price * detail.product[0].count || 'N/A'} EGP
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="px-4 py-3">
                    <h3 className="text-lg font-TextFontMedium text-secoundColor">{t("OrderDetails")}</h3>
                    <div className="space-y-1 text-sm text-secoundColor">
                      <p>{t("OrderType")}: {order.order_type.replace('_', ' ').replace(/^./, (c) => c.toUpperCase())}</p>
                      {
                        order.order_type === "take_away" && (
                          <p>{t("AddressName")}: {order.address_name || 'Not specified'}</p>
                        )
                      }
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="px-4 py-3">
                    <h3 className="text-lg font-TextFontMedium text-secoundColor">{t("PaymentDetails")}</h3>
                    <div className="space-y-1 text-sm text-secoundColor">
                      <p>{t("PaymentMethod")}: {order.payment_method.name}</p>
                      <p>{t("Delivery")}: {order.delivery_price || '0.00'} EGP</p>
                      <p className="font-TextFontMedium">{t("Total")}: <span className="text-red-500">{order.amount} EGP</span></p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
                    <Link
                      to={`order_traking/${order.id}`}
                      className="px-3 py-1 text-sm text-white bg-mainColor rounded-md"
                    >
                      {t("OrderTracking")}
                    </Link>
                    <button
                      onClick={() => isCancellable(order) && handleOpenCancelModal(order.id)}
                      disabled={!isCancellable(order)}
                      className={`px-3 py-1 text-sm rounded-md flex items-center ${isCancellable(order) ? 'text-red-500 bg-red-100 hover:bg-red-200' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                    >
                      <MdAutoDelete className="mr-1" /> {t("CancelOrder")}
                    </button>
                  </div>

                  {order.rejected_reason && (
                    <div className="px-4 py-3 bg-red-50 border-l-4 border-red-500">
                      <div className="flex items-center gap-2">
                        <Warning className="w-5 h-5 text-red-500" aria-hidden="true" />
                        <h3 className="text-sm font-TextFontMedium text-red-700">{t("RejectedReason")}</h3>
                      </div>
                      <p className="mt-1 text-sm text-red-600">{order.rejected_reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal */}
      {openCancelModal && (
        <Dialog open={true} onClose={handleCloseCancelModal} className="relative z-10">
          <DialogBackdrop className="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="w-full fixed inset-0 z-10 overflow-y-auto">
            <div className="w-full flex items-center justify-center min-h-screen">
              <DialogPanel className="relative bg-white rounded-2xl p-6 w-[30%]">
                <div className="flex flex-col items-center">
                  <Warning className="w-12 h-12" aria-hidden="true" />
                  <h3 className="text-lg font-TextFontMedium text-secoundColor mt-2">{t("CancelOrder")}</h3>
                  <p className="text-sm text-secoundColor text-center mt-2">{t("PleaseProvideReason")}</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder={t("EnterReason")}
                    className="w-full mt-4 p-2 border rounded-md text-sm"
                    rows="3"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={handleCloseCancelModal}
                    className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md"
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    onClick={() => handleCancelOrder(openCancelModal)}
                    className="px-4 py-2 text-sm text-white bg-mainColor rounded-md"
                    disabled={!cancelReason.trim()}
                  >
                    {t("ConfirmCancel")}
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default UpComingOrders;