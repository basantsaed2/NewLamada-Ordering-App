import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGet } from '../../../Hooks/useGet';
import { LoaderLogin } from '../../../Components/Components';
import { CookingIcon, OrderConfirmedIcon, OrderDeliveredIcon, OrderOnWayIcon, OrderPlacedIcon } from '../../../assets/Icons/Icons';
import { GiCancel } from 'react-icons/gi';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeAllProductsCard,
  removeOrder,
  removeTotlePrice,
} from '../../../Store/CreateSlices';
import { useAuth } from '../../../Context/Auth';

const OrderTraking = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const auth = useAuth();
  const { refetch: refetchOrders, loading: loadingOrders, data: dataOrder } = useGet({
    url: `https://Lamadafoodbcknd.food2go.online/customer/orders/order_status/${orderId}`,
  });
  const { t } = useTranslation();
  const [orderStatus, setOrderStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // Initial fetch
    refetchOrders();

    // Set up interval to refetch every 5 seconds, but only if status is not "canceled"
    const intervalId = setInterval(() => {
      if (orderStatus !== 'canceled' && orderStatus !== 'delivered') {
        refetchOrders();
        console.log(`Refetched order status for orderId: ${orderId}`);
      }
    }, 5000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [orderId, refetchOrders, orderStatus]);

  useEffect(() => {
    if (dataOrder && dataOrder.status) {
      setOrderStatus(dataOrder.status);
      // Set cancellation reason if status is "canceled"
      if (dataOrder.status === 'canceled') {
        setCancelReason(dataOrder.admin_cancel_reason || t('No Cancel Reason Provided'));
      } else {
        setCancelReason(''); // Clear reason for non-canceled statuses
      }
    }
  }, [dataOrder, t]);

  useEffect(() => {
    if (dataOrder && !loadingOrders) {
      dispatch(removeOrder());
      dispatch(removeTotlePrice());
      dispatch(removeAllProductsCard());
      // auth.toastSuccess("Order Placed Successfully");
    }
  }, [loadingOrders, dataOrder, dispatch]);

  return (
    <>
      {loadingOrders ? (
        <div className="flex items-center justify-center w-full h-full mt-16">
          <LoaderLogin />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start justify-start w-full h-full gap-4">
            {orderStatus === 'canceled' ? (
              <>
                {/* Cancelled */}
                <div className="flex items-center justify-center w-full mt-20 gap-x-4">
                  <GiCancel className="text-4xl text-mainColor" />
                  <span className="sm:text-2xl xl:text-4xl text-mainColor font-TextFontRegular">
                    {t('OrderIsCancelled')}
                  </span>
                </div>
                {/* Cancellation Reason */}
                {cancelReason && (
                  <div className="w-full mt-4 text-center">
                    <span className="sm:text-xl xl:text-2xl text-secoundColor font-TextFontRegular">
                      {t('Cancel Reason')}: {cancelReason}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Order Placed */}
                <div className="flex items-start justify-start w-full gap-10">
                  <div className="flex flex-col items-center justify-start gap-3">
                    <OrderPlacedIcon
                      width="35"
                      height="35"
                      isActive={
                        orderStatus === 'pending' ||
                        orderStatus === 'processing' ||
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                      }
                    />
                    <span
                      className={`${
                        orderStatus === 'pending' ||
                        orderStatus === 'processing' ||
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                          ? 'border-mainColor'
                          : 'border-secoundColor'
                      } h-16 border-2 border-dashed`}
                    ></span>
                  </div>
                  <span
                    className={`${
                      orderStatus === 'pending' ||
                      orderStatus === 'processing' ||
                      orderStatus === 'confirmed' ||
                      orderStatus === 'out_for_delivery' ||
                      orderStatus === 'delivered'
                        ? 'text-mainColor'
                        : 'text-secoundColor'
                    } sm:text-2xl xl:text-4xl font-TextFontRegular`}
                  >
                    {t('OrderPlaced')}
                  </span>
                </div>
                {/* Accept */}
                <div className="flex items-start justify-start w-full gap-10">
                  <div className="flex flex-col items-center justify-start gap-3">
                    <OrderConfirmedIcon
                      width="35"
                      height="35"
                      isActive={
                        orderStatus === 'processing' ||
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                      }
                    />
                    <span
                      className={`${
                        orderStatus === 'processing' ||
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                          ? 'border-mainColor'
                          : 'border-secoundColor'
                      } h-16 border-2 border-dashed`}
                    ></span>
                  </div>
                  <span
                    className={`${
                      orderStatus === 'processing' ||
                      orderStatus === 'confirmed' ||
                      orderStatus === 'out_for_delivery' ||
                      orderStatus === 'delivered'
                        ? 'text-mainColor'
                        : 'text-secoundColor'
                    } sm:text-2xl xl:text-4xl font-TextFontRegular`}
                  >
                    {t('Accept')}
                  </span>
                </div>
                {/* Processing */}
                <div className="flex items-start justify-start w-full gap-10">
                  <div className="flex flex-col items-center justify-start gap-3">
                    <CookingIcon
                      width="35"
                      height="35"
                      isActive={
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                      }
                    />
                    <span
                      className={`${
                        orderStatus === 'confirmed' ||
                        orderStatus === 'out_for_delivery' ||
                        orderStatus === 'delivered'
                          ? 'border-mainColor'
                          : 'border-secoundColor'
                      } h-16 border-2 border-dashed`}
                    ></span>
                  </div>
                  <span
                    className={`${
                      orderStatus === 'confirmed' ||
                      orderStatus === 'out_for_delivery' ||
                      orderStatus === 'delivered'
                        ? 'text-mainColor'
                        : 'text-secoundColor'
                    } sm:text-2xl xl:text-4xl font-TextFontRegular`}
                  >
                    {t('Cooking')}
                  </span>
                </div>
                {/* Out for delivery */}
                <div className="flex items-start justify-start w-full gap-10">
                  <div className="flex flex-col items-center justify-start gap-3">
                    <OrderOnWayIcon
                      width="35"
                      height="35"
                      isActive={orderStatus === 'out_for_delivery' || orderStatus === 'delivered'}
                    />
                    <span
                      className={`${
                        orderStatus === 'out_for_delivery' || orderStatus === 'delivered'
                          ? 'border-mainColor'
                          : 'border-secoundColor'
                      } h-16 border-2 border-dashed`}
                    ></span>
                  </div>
                  <span
                    className={`${
                      orderStatus === 'out_for_delivery' || orderStatus === 'delivered'
                        ? 'text-mainColor'
                        : 'text-secoundColor'
                    } sm:text-2xl xl:text-4xl font-TextFontRegular`}
                  >
                    {t('OrderIsOnTheWay')}
                  </span>
                </div>
                {/* Delivered */}
                <div className="flex items-center justify-start w-full gap-10">
                  <OrderDeliveredIcon
                    width="35"
                    height="35"
                    isActive={orderStatus === 'delivered'}
                  />
                  <span
                    className={`${
                      orderStatus === 'delivered' ? 'text-mainColor' : 'text-secoundColor'
                    } sm:text-2xl xl:text-4xl font-TextFontRegular`}
                  >
                    {t('OrderDelivered')}
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default OrderTraking;