import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGet } from '../../../Hooks/useGet';
import { LoaderLogin } from '../../../Components/Components';
import { CookingIcon, OrderConfirmedIcon, OrderDeliveredIcon, OrderOnWayIcon, OrderPlacedIcon } from '../../../assets/Icons/Icons';
import { GiCancel } from 'react-icons/gi';
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook
import { useDispatch, useSelector } from "react-redux";
import {
  removeAllProductsCard,
  removeOrder,
  removeTotlePrice,
} from ".././../../Store/CreateSlices";
import { useAuth } from '../../../Context/Auth';
const OrderTraking = () => {
       const { orderId } = useParams();  
       const dispatch = useDispatch();
       const auth = useAuth();
       
       const { refetch: refetchOrders, loading: loadingOrders, data: dataOrder } = useGet({
              url: `https://Lamadafoodbcknd.food2go.online/customer/orders/order_status/${orderId}}`,
       });
       const { t, i18n } = useTranslation(); // <-- use i18n to change language

       const [orderStatus, setOrderStatus] = useState('');

       useEffect(() => {
              refetchOrders();
       }, [orderId])
       useEffect(() => {
              if (dataOrder && dataOrder.status) {
                     console.log('dataOrder', dataOrder)
                     setOrderStatus(dataOrder.status)
              }
       }, [dataOrder])

       useEffect(() => {
              auth.toastSuccess("Order Placed Successfully")
              dispatch(removeOrder());
              dispatch(removeTotlePrice());
              dispatch(removeAllProductsCard());
       }, [orderStatus])

       return (
              <>
                     {loadingOrders ? (
                            <div className="flex items-center justify-center w-full h-full mt-16">
                                   <LoaderLogin />
                            </div>
                     ) : (
                            <>
                                   <span>
                                          {/* {orderStatus} */}
                                   </span>
                                   <div className="flex flex-col items-start justify-start w-full h-full gap-4">

                                          {orderStatus === 'canceled' ?
                                                 (
                                                        <>
                                                               {/* Cancelled */}
                                                               <div className="flex items-center justify-center w-full mt-20 gap-x-4">
                                                                      <GiCancel
                                                                             className='text-4xl text-mainColor'
                                                                      />
                                                                      <span className='sm:text-2xl xl:text-4xl text-mainColor font-TextFontRegular'>{t("OrderIsCancelled")}</span>
                                                               </div>
                                                        </>
                                                 ) : (
                                                        <>
                                                               {/* Order Placed */}
                                                               <div className="flex items-start justify-start w-full gap-10">
                                                                      <div className="flex flex-col items-center justify-start gap-3">
                                                                             <OrderPlacedIcon
                                                                                    width='35'
                                                                                    height='35'
                                                                                    isActive={
                                                                                           orderStatus === 'pending' ||
                                                                                           orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                                           orderStatus === 'delivered' && true}
                                                                             />
                                                                             <span className={`${orderStatus === 'pending' || orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                                    orderStatus === 'delivered' ?
                                                                                    'border-mainColor' : 'border-secoundColor'} h-16 border-2 border-dashed`}></span>
                                                                      </div>
                                                                      <span className={`${orderStatus === 'pending' || orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                             orderStatus === 'delivered' ?
                                                                             'text-mainColor' : 'text-secoundColor'} sm:text-2xl xl:text-4xl font-TextFontRegular`}
                                                                      >
                                                                             {t("OrderPlaced")}
                                                                      </span>
                                                               </div>
                                                               {/* Accept */}
                                                               <div className="flex items-start justify-start w-full gap-10">
                                                                      <div className="flex flex-col items-center justify-start gap-3">
                                                                             <OrderConfirmedIcon
                                                                                    width='35'
                                                                                    height='35'
                                                                                    isActive={orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                                           orderStatus === 'delivered'}
                                                                             />
                                                                             <span className={`${orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                                    orderStatus === 'delivered' ?
                                                                                    'border-mainColor' : 'border-secoundColor'} h-16 border-2 border-dashed`}></span>
                                                                      </div>
                                                                      <span className={`${orderStatus === 'processing' || orderStatus === 'confirmed' || orderStatus === 'out_for_delivery' ||
                                                                             orderStatus === 'delivered' ?
                                                                             'text-mainColor' : 'text-secoundColor'} sm:text-2xl xl:text-4xl font-TextFontRegular`}
                                                                      >
                                                                             {t("Accept")}
                                                                      </span>
                                                               </div>
                                                               {/* Processing */}
                                                               <div className="flex items-start justify-start w-full gap-10">
                                                                      <div className="flex flex-col items-center justify-start gap-3">
                                                                             <CookingIcon
                                                                                    width='35'
                                                                                    height='35'
                                                                                    isActive={
                                                                                           orderStatus === 'confirmed' ||
                                                                                           orderStatus === 'out_for_delivery' ||
                                                                                           orderStatus === 'delivered' && true
                                                                                    }
                                                                             />
                                                                             <span className={`${orderStatus === 'confirmed' ||
                                                                                    orderStatus === 'out_for_delivery' ||
                                                                                    orderStatus === 'delivered' ?
                                                                                    'border-mainColor' : 'border-secoundColor'} h-16 border-2 border-dashed`}></span>
                                                                      </div>
                                                                      <span className={`${orderStatus === 'confirmed' ||
                                                                             orderStatus === 'out_for_delivery' ||
                                                                             orderStatus === 'delivered' ?
                                                                             'text-mainColor' : 'text-secoundColor'} sm:text-2xl xl:text-4xl font-TextFontRegular`}
                                                                      >
                                                                             {t("Cooking")}
                                                                      </span>
                                                               </div>
                                                               {/* Out for delivery */}
                                                               <div className="flex items-start justify-start w-full gap-10">
                                                                      <div className="flex flex-col items-center justify-start gap-3">
                                                                             <OrderOnWayIcon
                                                                                    width='35'
                                                                                    height='35'
                                                                                    isActive={
                                                                                           orderStatus === 'out_for_delivery' ||
                                                                                           orderStatus === 'delivered' && true}
                                                                             />
                                                                             <span className={`${orderStatus === 'out_for_delivery' ||
                                                                                    orderStatus === 'delivered' ?
                                                                                    'border-mainColor' : 'border-secoundColor'} h-16 border-2 border-dashed`}></span>
                                                                      </div>
                                                                      <span className={`${orderStatus === 'out_for_delivery' ||
                                                                             orderStatus === 'delivered' ?
                                                                             'text-mainColor' : 'text-secoundColor'} sm:text-2xl xl:text-4xl font-TextFontRegular`}
                                                                      >
                                                                             {t("OrderIsOnTheWay")}
                                                                      </span>
                                                               </div>
                                                               {/* Delivered */}
                                                               <div className="flex items-center justify-start w-full gap-10">
                                                                      <OrderDeliveredIcon
                                                                             width='35'
                                                                             height='35'
                                                                             isActive={orderStatus === 'delivered' && true}
                                                                      />
                                                                      <span className={`${orderStatus === 'delivered' ? 'text-mainColor' : 'text-secoundColor'} sm:text-2xl xl:text-4xl font-TextFontRegular`}>{t("OrderDelivered")}</span>
                                                               </div>
                                                        </>
                                                 )}
                                   </div>
                            </>
                     )}
              </>
       )
}

export default OrderTraking