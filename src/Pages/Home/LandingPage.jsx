import React, { useEffect, useState } from 'react';
import { FiHome } from "react-icons/fi";
import { MdWork } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateOrder, setPickupLoctaion, setCategories, setProducts, setProductsDiscount, setProductsDiscountFilter, setProductsFilter, setTaxType, setLocations } from '../../Store/CreateSlices';
import AddButton from '../../Components/Buttons/AddButton';
import { useNavigate } from 'react-router-dom';
import { useDelete } from '../../Hooks/useDelete';
import { MdDelete } from "react-icons/md";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PiWarningCircle } from "react-icons/pi";
import { MdDeliveryDining } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { StaticSpinner } from '../../Components/Components';
import { useGet } from '../../Hooks/useGet';
import { useAuth } from '../../Context/Auth';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(state => state.language?.selected ?? 'en');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();
  const order = useSelector(state => state?.order?.data || {});
  const total = useSelector(state => state?.totalPrice?.data || 0);
  const { deleteData } = useDelete();
  const [openDelete, setOpenDelete] = useState(null);

  const orderTypes = useSelector(state => state.checkOutDetails?.data?.order_types || []);
  const allBranches = useSelector(state => state.checkOutDetails?.data?.branches || []);
  const allLocations = useSelector(state => state.location.data || []);

  // Initialize state with localStorage values
  const [orderTypeSelected, setOrderTypeSelected] = useState(localStorage.getItem('orderTypeSelected') || '');
  const [orderTypeId, setOrderTypeId] = useState(localStorage.getItem('orderTypeId') || null);
  const [brancheId, setBrancheId] = useState(localStorage.getItem('brancheId') || '');
  const [locationId, setLocationId] = useState(localStorage.getItem('locationId') || '');
  const [deliveryPrice, setDeliveryPrice] = useState(localStorage.getItem('deliveryPrice') || '');
  const [canNavigate, setCanNavigate] = useState(false);

  // Initialize order type only if not set
  useEffect(() => {
    if (orderTypes.length > 0 && !orderTypeSelected && !orderTypeId) {
      const defaultOrderType = orderTypes[0];
      setOrderTypeSelected(defaultOrderType.type);
      // setOrderTypeId(defaultOrderType.id.toString()); // Ensure string for localStorage
    }
  }, [orderTypes, orderTypeSelected, orderTypeId]);

  // Fetch products
  const key = brancheId ? 'branch_id' : 'address_id';
  const value = brancheId || locationId;
  const {
    refetch: refetchProducts,
    loading: loadingProducts,
    data: dataProducts
  } = useGet({
    url: `https://Lamadafoodbcknd.food2go.online/customer/home/web_products?${key}=${value}&locale=${selectedLanguage}`,
    skip: !value
  });

  // Handle product fetch and Redux updates
  useEffect(() => {
    if (value) {
      dispatch(setPickupLoctaion(value));
      refetchProducts();
    }
  }, [value, selectedLanguage, refetchProducts, dispatch]);

  useEffect(() => {
    if (dataProducts && value) {
      dispatch(setTaxType(dataProducts?.tax || null));
      dispatch(setProducts(dataProducts?.products || null));
      dispatch(setProductsFilter(dataProducts?.products || null));
      dispatch(setCategories(dataProducts?.categories || null));
      dispatch(setProductsDiscount(dataProducts?.discounts || null));
      dispatch(setProductsDiscountFilter(dataProducts?.discounts || null));
      setCanNavigate(true);
    }
  }, [dataProducts, dispatch, value, selectedLanguage]);

  // Handle localStorage and delivery redirect
  useEffect(() => {
    if ((orderTypeSelected === 'delivery' || orderTypeId === '3') && !auth.user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    // Update localStorage only if values have changed
    const updates = [
      { key: 'orderTypeSelected', value: orderTypeSelected },
      { key: 'orderTypeId', value: orderTypeId || '' },
      // { key: 'brancheId', value: brancheId },
      // { key: 'locationId', value: locationId },
      // { key: 'deliveryPrice', value: deliveryPrice }
    ];

    updates.forEach(({ key, value }) => {
      if (localStorage.getItem(key) !== value) {
        localStorage.setItem(key, value);
      }
    });
  }, [orderTypeSelected, orderTypeId,auth.user, navigate]);

  // Update Redux order
  useEffect(() => {
    const newOrder = {
      ...order,
      order_type: orderTypeSelected,
      branch_id: brancheId,
      address_id: locationId,
      delivery_price: deliveryPrice,
      amount: Number(total) + Number(deliveryPrice || 0)
    };

    // Only dispatch if order has changed
    if (JSON.stringify(newOrder) !== JSON.stringify(order)) {
      dispatch(UpdateOrder(newOrder));
    }
  }, [orderTypeSelected, brancheId, locationId, deliveryPrice, total, dispatch, order]);

  // Navigate to menu
  useEffect(() => {
    if (canNavigate && !loadingProducts && (brancheId || locationId)) {
      navigate('/menu', { replace: true });
    }
  }, [canNavigate, loadingProducts, brancheId, locationId, navigate]);

  const handleSelectBranch = (branch) => {
    if (brancheId !== branch.id) {
      setBrancheId(branch.id);
      setDeliveryPrice('');
      setLocationId('');
      setCanNavigate(false); // Reset navigation until products are fetched
    }
  };

  const handleSelectLocation = (location) => {
    if (locationId !== location.id) {
      setLocationId(location.id);
      setDeliveryPrice(location?.zone?.price || '');
      setBrancheId('');
      setCanNavigate(false); // Reset navigation until products are fetched
    }
  };

  const handleAddAddress = () => {
    navigate('/check_out/add_address');
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };

  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  const handleDelete = async (id, name) => {
    const success = await deleteData(`https://Lamadafoodbcknd.food2go.online/customer/address/delete/${id}`, `${name} Deleted Success.`);
    if (success) {
      const updatedLocations = allLocations.filter(location => location.id !== id);
      dispatch(setLocations(updatedLocations));
      if (locationId === id) {
        setLocationId('');
        setDeliveryPrice('');
        setCanNavigate(false);
      }
    }
    handleCloseDelete();
  };

  if (loadingProducts) {
    return <StaticSpinner />;
  }

  return (
    <div className='flex flex-col w-full gap-3 mb-5'>
      <div className="flex flex-col w-full gap-5 p-4 lg:flex-row">
        {/* Navbar Type Order */}
        <div className="flex flex-col items-center justify-center w-full gap-5 pt-4 lg:w-1/2 gap-x-3 md:p-6">
          <h1 className='text-2xl font-semibold'>{t("PickUPOrDelivery")}</h1>
          <div className="flex items-center justify-center w-full gap-x-4 md:gap-x-6">
            {orderTypes.map((type) => (
              type.status === 1 && (
                <span
                  key={type.id}
                  className={`flex min-w-40 h-40 flex-col items-center justify-center gap-2 text-xl font-TextFontRegular px-4 py-2 rounded-lg cursor-pointer border-2 transition-all ease-in-out duration-300
                    ${orderTypeSelected === type.type ? 'text-mainColor  border-mainColor bg-white ' : 'text-mainColor bg-[#F6E7E7] border-[#F6E7E7]'}`}
                  onClick={() => {
                    if (orderTypeSelected !== type.type || orderTypeId !== type.id.toString()) {
                      setOrderTypeSelected(type.type);
                      setOrderTypeId(type.id.toString());
                      setBrancheId('');
                      setLocationId('');
                      setDeliveryPrice('');
                      setCanNavigate(false);
                    }
                  }}
                >
                  {type.type === "delivery" ? (
                    <>
                      <MdDeliveryDining size={64} />
                      <span>{t("Delivery")}</span>
                    </>
                  ) : type.type === "take_away" ? (
                    <>
                      <GiMeal size={64} />
                      <span>{t("Take_away")}</span>
                    </>
                  ) : null}
                </span>
              )
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center w-full gap-5 lg:w-1/2 gap-x-3">
          {orderTypeId === '3' && (
            <>
              <h1 className='text-2xl font-semibold'>{t("SelectAddress")}</h1>
              <div className='flex justify-end w-full'>
                <AddButton handleClick={handleAddAddress} text={t("AddNewAddress")} Color='mainColor' iconColor='mainColor' />
              </div>
              <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                {allLocations.map((location) => (
                  <div key={location.id} className="relative">
                    <div
                      onClick={() => handleSelectLocation(location)}
                      className={`group w-full flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm 
                        ${locationId === location.id ? 'bg-mainColor text-white' : 'bg-gray-100 text-black hover:bg-mainColor hover:text-white hover:border-mainColor'}`}
                    >
                      <div className="flex-shrink-0 p-2 transition rounded-md bg-mainColor group-hover:bg-mainColor">
                        {location.type === 'Home' ? (
                          <FiHome className="w-6 h-6 text-white" />
                        ) : (
                          <MdWork className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex flex-col w-full space-y-1 text-sm">
                        <p className="font-semibold line-clamp-1">
                          {location.address?.charAt(0).toUpperCase() + (location.address?.slice(1) || '')}
                        </p>
                        <p className="text-xs line-clamp-1">
                          <strong>{t("Bldg")}:</strong> {location.building_num || '-'} | 
                          <strong>{t("Floor")}:</strong> {location.floor_num || '-'} | 
                          <strong>{t("Apt")}:</strong> {location.apartment || '-'}
                        </p>
                        <p className="text-xs line-clamp-1">
                          <strong>{t("Extra")}:</strong> {location.additional_data || '-'}
                        </p>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                          <span className="text-xs font-medium">{t("zoneprice")}: {location?.zone?.price || '-'}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDelete(location.id);
                            }}
                            className="transition hover:text-white"
                          >
                            <MdDelete size="18" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {openDelete === location.id && (
                      <Dialog open={true} onClose={handleCloseDelete} className="relative z-10">
                        <DialogBackdrop className="fixed inset-0 bg-black/30" />
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                          <div className="flex items-center justify-center min-h-full p-4">
                            <DialogPanel className="w-full max-w-sm bg-white shadow-lg rounded-xl">
                              <div className="flex flex-col items-center px-6 py-6">
                                <PiWarningCircle size="50" className="mb-3 text-mainColor" />
                                <div className="text-center text-gray-800">
                                  {t("Areyousureyouwanttodeletethislocation?")}
                                  <div className="mt-1 text-sm font-semibold">{location.address || '-'}</div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 px-6 pb-4">
                                <button
                                  className="px-4 py-2 text-sm text-white transition rounded-lg bg-mainColor hover:bg-mainColor/90"
                                  onClick={() => handleDelete(location.id, location?.address)}
                                >
                                  {t("Delete")}
                                </button>
                                <button
                                  onClick={handleCloseDelete}
                                  className="px-4 py-2 text-sm text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                  {t("Cancel")}
                                </button>
                              </div>
                            </DialogPanel>
                          </div>
                        </div>
                      </Dialog>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {(orderTypeId === '1' || orderTypeId === '2') && (
            <div className="flex flex-col items-start w-full gap-3 justify-evenly">
              <h1 className='text-2xl font-semibold'>{t("SelectBranch")}</h1>
              <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-3">
                {allBranches.map((branche) => (
                  <div
                    key={branche.id}
                    className={`w-full flex items-center justify-start gap-x-3 text-xl font-TextFontRegular px-3 py-3 rounded-xl cursor-pointer transition-all ease-in-out duration-300
                      ${brancheId === branche.id ? 'text-white bg-mainColor' : 'text-black bg-gray-100 hover:bg-mainColor hover:text-white'}`}
                    onClick={() => handleSelectBranch(branche)}
                  >
                    <img
                      src={branche?.image_link || ''}
                      alt={branche?.name || 'Branch Image'}
                      className={`w-14 h-14 md:w-20 md:h-20 rounded-full object-cover object-center`}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className='sm:text-lg xl:text-xl font-TextFontRegular'>
                        {branche.name.charAt(0).toUpperCase() + (branche.name.slice(1) || '')}
                      </span>
                      <span className='sm:text-xs xl:text-lg font-TextFontRegular'>
                        {branche.address.charAt(0).toUpperCase() + (branche.address.slice(1) || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;