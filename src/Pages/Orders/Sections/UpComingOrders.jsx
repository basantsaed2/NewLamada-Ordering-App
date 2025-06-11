// import React, { useEffect, useState } from 'react';
// import { useGet } from '../../../Hooks/useGet';
// import { LinkButton, LoaderLogin } from '../../../Components/Components';
// import EmptyOrdersIcon from '../../../assets/Icons/EmptyOrdersIcon';
// import { Link } from 'react-router-dom';
// import { MdAutoDelete } from 'react-icons/md';
// import { FaPhone } from 'react-icons/fa'; // Added Phone icon for HotLine
// import { FaCopy } from 'react-icons/fa'; // Added Copy icon
// import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// import Warning from '../../../assets/Icons/WarningIcon';
// import { useChangeState } from '../../../Hooks/useChangeState';
// import { useTranslation } from 'react-i18next';

// const UpComingOrders = () => {
//   const { t, i18n } = useTranslation();

//   const { refetch: refetchOrders, loading: loadingOrders, data: dataOrders } = useGet({
//     url: 'https://Lamadafoodbcknd.food2go.online/customer/orders',
//   });
//   const { changeState: cancelOrder, loadingChange: loadingCancel } = useChangeState();

//   const [orders, setOrders] = useState([]);
//   const [cancelledTime, setCancelledTime] = useState('');
//   const [openCancelModal, setOpenCancelModal] = useState(null);
//   const [openHotlineModal, setOpenHotlineModal] = useState(false); // State for hotline modal
//   const [cancelReason, setCancelReason] = useState('');
//   const [copySuccess, setCopySuccess] = useState(''); // State for copy feedback

//   // Placeholder hotline number (replace with actual number)
//   const hotlineNumber = '16365';

//   useEffect(() => {
//     refetchOrders();
//   }, [refetchOrders]);

//   useEffect(() => {
//     if (dataOrders && dataOrders.orders) {
//       setCancelledTime(dataOrders.cancel_time);
//       setOrders(dataOrders.orders);
//     }
//   }, [dataOrders]);

//   useEffect(() => {
//     // Function to check cancellability and update state
//     const checkCancellability = () => {
//       const currentTime = new Date().getTime();
//       setOrders((prevOrders) =>
//         prevOrders.map((order) => ({
//           ...order,
//           isCancellable: isCancellable(order, cancelledTime || '00:05'),
//         }))
//       );
//     };

//     // Run immediately on mount and every 30 seconds
//     checkCancellability();
//     const interval = setInterval(checkCancellability, 30 * 1000); // Update every 30 seconds

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, [cancelledTime, orders]);

//   const handleOpenCancelModal = (orderId) => setOpenCancelModal(orderId);
//   const handleCloseCancelModal = () => {
//     setOpenCancelModal(null);
//     setCancelReason('');
//   };

//   const handleOpenHotlineModal = () => setOpenHotlineModal(true);
//   const handleCloseHotlineModal = () => {
//     setOpenHotlineModal(false);
//     setCopySuccess('');
//   };

//   const handleCancelOrder = async (id) => {
//     await cancelOrder(
//       `https://Lamadafoodbcknd.food2go.online/customer/orders/cancel/${id}`,
//       `Order #${id} is Cancelled. Reason: ${cancelReason}`,
//       { status: '', customer_cancel_reason: cancelReason }
//     );
//     handleCloseCancelModal();
//     refetchOrders();
//   };

//   const handleCopyNumber = () => {
//     navigator.clipboard.writeText(hotlineNumber).then(() => {
//       setCopySuccess(t('Number Copied'));
//       setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
//     }).catch(() => {
//       setCopySuccess(t('Copy Failed'));
//     });
//   };

//   const isCancellable = (order, cancelTime = '00:05') => {
//     try {
//       // Get current time
//       const currentTime = new Date().getTime();

//       // Parse order time
//       const orderTimeString = `${order.order_date}T${order.date}+03:00`;
//       const orderTime = new Date(orderTimeString).getTime();

//       // Validate order time
//       if (isNaN(orderTime)) {
//         console.error('Invalid order date or time:', order.order_date, order.date);
//         return false;
//       }

//       // Parse cancellation window
//       const [hours, minutes] = cancelTime.split(':').map(Number);
//       if (isNaN(hours) || isNaN(minutes)) {
//         console.error('Invalid cancellation time format:', cancelTime);
//         return false;
//       }

//       // Convert cancellation window to milliseconds
//       const cancelWindow = (hours * 3600 + minutes * 60) * 1000;

//       return currentTime - orderTime <= cancelWindow;
//     } catch (error) {
//       console.error('Error in isCancellable:', error);
//       return false;
//     }
//   };

//   const formatTime = (dateString, timeString) => {
//     const date = new Date(`${dateString}T${timeString}`);
//     return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
//   };

//   return (
//     <>
//       {loadingOrders || loadingCancel ? (
//         <div className="flex items-center justify-center w-full h-full mt-16">
//           <LoaderLogin />
//         </div>
//       ) : (
//         <div className="w-full h-[65vh] overflow-y-scroll rounded-xl p-2 shadow-md">
//           {orders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center mt-16">
//               <EmptyOrdersIcon />
//               <span className="text-2xl font-TextFontRegular text-thirdColor">{t('NoOdeOrders')}</span>
//               <span className="text-xl font-TextFontLight text-secoundColor">{t('YouHaven\'tMadeAnyPurchaseYet')}</span>
//               <div className="mt-8">
//                 <LinkButton text={t('ExploreMenu')} to="/" />
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {orders.map((order) => {
//                 const canCancel = isCancellable(order, cancelledTime);
//                 return (
//                   <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
//                     {/* Order Number */}
//                     <div className="px-4 py-3 bg-gray-50">
//                       <div className="flex gap-2 items-center">
//                         <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('Order#')}</h3>
//                         <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">{order.id}</span>
//                       </div>
//                     </div>
//                     {/* Order Status */}
//                     <div className="px-4 py-3 bg-gray-50">
//                       <div className="flex justify-between items-center">
//                         <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderStatus')}</h3>
//                         <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">{order.order_status}</span>
//                       </div>
//                       <p className="text-sm text-secoundColor">{t('OrderDate')}: {order.order_date} - {formatTime(order.order_date, order.date)}</p>
//                     </div>

//                     {/* Order Items */}
//                     <div className="px-4 py-3">
//                       <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderItems')}</h3>
//                       {order.order_details.map((detail, idx) => (
//                         <div key={idx} className="flex justify-between items-center text-sm py-1">
//                           <div>
//                             <p className="font-TextFontRegular">{detail.product[0].product.name}</p>
//                             <span className="text-xs text-gray-500">x{detail.product[0].count}</span>
//                           </div>
//                           <span className="text-red-500 font-TextFontMedium">
//                             {detail.product[0].product.price * detail.product[0].count || 'N/A'} EGP
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Order Details */}
//                     <div className="px-4 py-3">
//                       <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderDetails')}</h3>
//                       <div className="space-y-1 text-sm text-secoundColor">
//                         <p>{t('OrderType')}: {order.order_type.replace('_', ' ').replace(/^./, (c) => c.toUpperCase())}</p>
//                         {order.order_type === 'take_away' && (
//                           <p>{t('AddressName')}: {order.address_name || 'Not specified'}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Payment Details */}
//                     <div className="px-4 py-3">
//                       <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('PaymentDetails')}</h3>
//                       <div className="space-y-1 text-sm text-secoundColor">
//                         <p>{t('PaymentMethod')}: {order.payment_method.name}</p>
//                         <p>{t('Delivery')}: {order.delivery_price || '0.00'} EGP</p>
//                         <p className="font-TextFontMedium">{t('Total')}: <span className="text-red-500">{order.amount} EGP</span></p>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
//                       <Link
//                         to={`order_traking/${order.id}`}
//                         className="px-3 py-1 text-sm text-white bg-mainColor rounded-md"
//                       >
//                         {t('OrderTracking')}
//                       </Link>
//                       {canCancel ? (
//                         <button
//                           onClick={() => handleOpenCancelModal(order.id)}
//                           className="px-3 py-1 text-sm rounded-md flex items-center text-red-500 bg-red-100 hover:bg-red-200"
//                         >
//                           <MdAutoDelete className="mr-1" /> {t('CancelOrder')}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={handleOpenHotlineModal}
//                           className="px-3 py-1 text-sm rounded-md flex items-center text-red-500 bg-red-100 hover:bg-red-200"
//                           title={t('ContactHotline')}
//                         >
//                           <FaPhone className="mr-1" /> {t('HotLine')}
//                         </button>
//                       )}
//                     </div>

//                     {order.rejected_reason && (
//                       <div className="px-4 py-3 bg-red-50 border-l-4 border-red-500">
//                         <div className="flex items-center gap-2">
//                           <Warning className="w-5 h-5 text-red-500" aria-hidden="true" />
//                           <h3 className="text-sm font-TextFontMedium text-red-700">{t('RejectedReason')}</h3>
//                         </div>
//                         <p className="mt-1 text-sm text-red-600">{order.rejected_reason}</p>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Cancel Order Modal */}
//       {openCancelModal && (
//         <Dialog open={true} onClose={handleCloseCancelModal} className="relative z-10">
//           <DialogBackdrop className="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//           <div className="w-full fixed inset-0 z-10 overflow-y-auto">
//             <div className="w-full flex items-center justify-center min-h-screen">
//               <DialogPanel className="relative bg-white rounded-2xl p-6 w-[30%]">
//                 <div className="flex flex-col items-center">
//                   <Warning className="w-12 h-12" aria-hidden="true" />
//                   <h3 className="text-lg font-TextFontMedium text-secoundColor mt-2">{t('CancelOrder')}</h3>
//                   <p className="text-sm text-secoundColor text-center mt-2">{t('PleaseProvideReason')}</p>
//                   <textarea
//                     value={cancelReason}
//                     onChange={(e) => setCancelReason(e.target.value)}
//                     placeholder={t('EnterReason')}
//                     className="w-full mt-4 p-2 border rounded-md text-sm"
//                     rows="3"
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-end gap-3">
//                   <button
//                     onClick={handleCloseCancelModal}
//                     className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md"
//                   >
//                     {t('Cancel')}
//                   </button>
//                   <button
//                     onClick={() => handleCancelOrder(openCancelModal)}
//                     className="px-4 py-2 text-sm text-white bg-mainColor rounded-md"
//                     disabled={!cancelReason.trim()}
//                   >
//                     {t('ConfirmCancel')}
//                   </button>
//                 </div>
//               </DialogPanel>
//             </div>
//           </div>
//         </Dialog>
//       )}

//       {/* Hotline Modal */}
//       {openHotlineModal && (
//         <Dialog open={true} onClose={handleCloseHotlineModal} className="relative z-10">
//           <DialogBackdrop className="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//           <div className="w-full fixed inset-0 z-10 overflow-y-auto">
//             <div className="w-full flex items-center justify-center min-h-screen">
//               <DialogPanel className="relative bg-white rounded-2xl p-6 w-[30%]">
//                 <div className="flex flex-col items-center">
//                   <FaPhone className="w-12 h-12 text-red-500" aria-hidden="true" />
//                   <h3 className="text-lg font-TextFontMedium text-secoundColor mt-2">{t('Contact Hotline')}</h3>
//                   <p className="text-sm text-secoundColor text-center mt-2">
//                     {t('For Cancelation Call Our Hotline For Assistance')}
//                   </p>
//                   <div className="flex items-center mt-4 gap-2">
//                     <p className="text-lg font-TextFontMedium text-secoundColor">{hotlineNumber}</p>
//                     <button
//                       onClick={handleCopyNumber}
//                       className="p-2 text-red-500 hover:text-red-700"
//                       title={t('Copy Number')}
//                     >
//                       <FaCopy className="w-5 h-5" />
//                     </button>
//                   </div>
//                   {copySuccess && (
//                     <p className="text-sm text-green-500 mt-2">{copySuccess}</p>
//                   )}
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={handleCloseHotlineModal}
//                     className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md"
//                   >
//                     {t('Close')}
//                   </button>
//                 </div>
//               </DialogPanel>
//             </div>
//           </div>
//         </Dialog>
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
import { FaPhone } from 'react-icons/fa'; // Added Phone icon for HotLine
import { FaCopy } from 'react-icons/fa'; // Added Copy icon
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
  const [openHotlineModal, setOpenHotlineModal] = useState(false); // State for hotline modal
  const [cancelReason, setCancelReason] = useState('');
  const [copySuccess, setCopySuccess] = useState(''); // State for copy feedback

  // Placeholder hotline number (replace with actual number)
  const hotlineNumber = '16365';

  useEffect(() => {
    refetchOrders();
  }, [refetchOrders]);

  useEffect(() => {
    if (dataOrders && dataOrders.orders) {
      setCancelledTime(dataOrders.cancel_time);
      setOrders(dataOrders.orders);
    }
  }, [dataOrders]);

  useEffect(() => {
    // Function to check cancellability and update state only if necessary
    const checkCancellability = () => {
      const currentTime = new Date().getTime();
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          const isCancellableStatus = isCancellable(order, cancelledTime || '00:05');
          return order.isCancellable !== isCancellableStatus
            ? { ...order, isCancellable: isCancellableStatus }
            : order;
        });
        // Only return updatedOrders if there's an actual change
        return prevOrders.some((order, i) => order.isCancellable !== updatedOrders[i].isCancellable)
          ? updatedOrders
          : prevOrders;
      });
    // Run immediately and set interval
    checkCancellability();
    const interval = setInterval(checkCancellability, 30 * 1000); // Update every 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }}, [cancelledTime]); // Removed 'orders' from dependencies

  const handleOpenCancelModal = (orderId) => setOpenCancelModal(orderId);
  const handleCloseCancelModal = () => {
    setOpenCancelModal(null);
    setCancelReason('');
  };

  const handleOpenHotlineModal = () => setOpenHotlineModal(true);
  const handleCloseHotlineModal = () => {
    setOpenHotlineModal(false);
    setCopySuccess('');
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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(hotlineNumber).then(() => {
      setCopySuccess(t('Number Copied'));
      setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
    }).catch(() => {
      setCopySuccess(t('Copy Failed'));
    });
  };

  const isCancellable = (order, cancelTime = '00:05') => {
    try {
      // Get current time
      const currentTime = new Date().getTime();

      // Parse order time
      const orderTimeString = `${order.order_date}T${order.date}+03:00`;
      const orderTime = new Date(orderTimeString).getTime();

      // Validate order time
      if (isNaN(orderTime)) {
        console.error('Invalid order date or time:', order.order_date, order.date);
        return false;
      }

      // Parse cancellation window
      const [hours, minutes] = cancelTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid cancellation time format:', cancelTime);
        return false;
      }

      // Convert cancellation window to milliseconds
      const cancelWindow = (hours * 3600 + minutes * 60) * 1000;

      return currentTime - orderTime <= cancelWindow;
    } catch (error) {
      console.error('Error in isCancellable:', error);
      return false;
    }
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
              <span className="text-2xl font-TextFontRegular text-thirdColor">{t('NoOdeOrders')}</span>
              <span className="text-xl font-TextFontLight text-secoundColor">{t('YouHaven\'tMadeAnyPurchaseYet')}</span>
              <div className="mt-8">
                <LinkButton text={t('ExploreMenu')} to="/" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const canCancel = order.isCancellable;
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Order Number */}
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex gap-2 items-center">
                        <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('Order#')}</h3>
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">{order.id}</span>
                      </div>
                    </div>
                    {/* Order Status */}
                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderStatus')}</h3>
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">{order.order_status}</span>
                      </div>
                      <p className="text-sm text-secoundColor">{t('OrderDate')}: {order.order_date} - {formatTime(order.order_date, order.date)}</p>
                    </div>

                    {/* Order Items */}
                    <div className="px-4 py-3">
                      <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderItems')}</h3>
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
                      <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('OrderDetails')}</h3>
                      <div className="space-y-1 text-sm text-secoundColor">
                        <p>{t('OrderType')}: {order.order_type.replace('_', ' ').replace(/^./, (c) => c.toUpperCase())}</p>
                        {order.order_type === 'take_away' && (
                          <p>{t('AddressName')}: {order.address_name || 'Not specified'}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="px-4 py-3">
                      <h3 className="text-lg font-TextFontMedium text-secoundColor">{t('PaymentDetails')}</h3>
                      <div className="space-y-1 text-sm text-secoundColor">
                        <p>{t('PaymentMethod')}: {order.payment_method.name}</p>
                        <p>{t('Delivery')}: {order.delivery_price || '0.00'} EGP</p>
                        <p className="font-TextFontMedium">{t('Total')}: <span className="text-red-500">{order.amount} EGP</span></p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
                      <Link
                        to={`order_traking/${order.id}`}
                        className="px-3 py-1 text-sm text-white bg-mainColor rounded-md"
                      >
                        {t('OrderTracking')}
                      </Link>
                      {canCancel ? (
                        <button
                          onClick={() => handleOpenCancelModal(order.id)}
                          className="px-3 py-1 text-sm rounded-md flex items-center text-red-500 bg-red-100 hover:bg-red-200"
                        >
                          <MdAutoDelete className="mr-1" /> {t('CancelOrder')}
                        </button>
                      ) : (
                        <button
                          onClick={handleOpenHotlineModal}
                          className="px-3 py-1 text-sm rounded-md flex items-center text-red-500 bg-red-100 hover:bg-red-200"
                          title={t('ContactHotline')}
                        >
                          <FaPhone className="mr-1" /> {t('HotLine')}
                        </button>
                      )}
                    </div>

                    {order.rejected_reason && (
                      <div className="px-4 py-3 bg-red-50 border-l-4 border-red-500">
                        <div className="flex items-center gap-2">
                          <Warning className="w-5 h-5 text-red-500" aria-hidden="true" />
                          <h3 className="text-sm font-TextFontMedium text-red-700">{t('RejectedReason')}</h3>
                        </div>
                        <p className="mt-1 text-sm text-red-600">{order.rejected_reason}</p>
                      </div>
                    )}
                  </div>
                );
              })}
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
                  <h3 className="text-lg font-TextFontMedium text-secoundColor mt-2">{t('CancelOrder')}</h3>
                  <p className="text-sm text-secoundColor text-center mt-2">{t('PleaseProvideReason')}</p>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder={t('EnterReason')}
                    className="w-full mt-4 p-2 border rounded-md text-sm"
                    rows="3"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={handleCloseCancelModal}
                    className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    onClick={() => handleCancelOrder(openCancelModal)}
                    className="px-4 py-2 text-sm text-white bg-mainColor rounded-md"
                    disabled={!cancelReason.trim()}
                  >
                    {t('ConfirmCancel')}
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}

      {/* Hotline Modal */}
      {openHotlineModal && (
        <Dialog open={true} onClose={handleCloseHotlineModal} className="relative z-10">
          <DialogBackdrop className="w-full fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          <div className="w-full fixed inset-0 z-10 overflow-y-auto">
            <div className="w-full flex items-center justify-center min-h-screen">
              <DialogPanel className="relative bg-white rounded-2xl p-6 w-[30%]">
                <div className="flex flex-col items-center">
                  <FaPhone className="w-12 h-12 text-red-500" aria-hidden="true" />
                  <h3 className="text-lg font-sans text-secoundColor mt-2">{t('Contact Hotline')}</h3>
                  <p className="text-sm text-secoundColor text-center mt-2">
                    {t('For Cancelation Call Our Hotline For Assistance')}
                  </p>
                  <div className="flex items-center items-center mt-4 gap-2">
                    <p className="text-lg font-medium text-secoundColor">{hotlineNumber}</p>
                    <button
                      onClick={handleCopyNumber}
                      className="p-2 text-red-500 hover:text-red-700"
                      title={t('Copy Number')}
                    >
                      <FaCopy className="w-5 h-5" />
                    </button>
                  </div>
                  {copySuccess && (
                    <p className="text-sm text-green-500 mt-2">{copySuccess}</p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleOpenHotlineModal}
                    className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md"
                  >
                    {t('Close')}
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