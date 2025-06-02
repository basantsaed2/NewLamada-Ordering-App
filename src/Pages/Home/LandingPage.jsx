import React, { useEffect, useState } from 'react'
import { FiHome } from "react-icons/fi";
import { MdWork } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { UpdateOrder } from '../../Store/CreateSlices';
import AddButton from '../../Components/Buttons/AddButton';
import { useNavigate, Link } from 'react-router-dom';
import { useDelete } from '../../Hooks/useDelete';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PiWarningCircle } from "react-icons/pi";
import { MdDeliveryDining } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import logo from '../../assets/Images/logo.jpg'
import { HeaderNavigate, LoaderLogin, StaticSpinner, SubmitButton } from '../../Components/Components'
import { setPickupLoctaion, setCategories, setProducts, setProductsDiscount, setProductsDiscountFilter, setProductsFilter, setTaxType } from './../../Store/CreateSlices';
import { useGet } from '../../Hooks/useGet';
import { useAuth } from '../../Context/Auth'
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

// Import your fetchLocations thunk action
import { setLocations } from '../../Store/CreateSlices';
const LandingPage = () => {
  const { t, i18n } = useTranslation(); // <-- use i18n to change language
  const selectedLanguage = useSelector(state => state.language?.selected ?? 'en'); // Default to 'en' if no language is selected

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useAuth();
  const order = useSelector(state => state?.order?.data || {});
  const products = useSelector(state => state?.productsCard?.data || []);
  const total = useSelector(state => state?.totalPrice?.data || 0);
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [openDelete, setOpenDelete] = useState(null);

  const orderTypes = useSelector(state => state.checkOutDetails?.data?.order_types || []);
  const allBranches = useSelector(state => state.checkOutDetails?.data?.branches || []);
  const allLocations = useSelector(state => state.location.data || []);
  const [orderTypeSelected, setOrderTypeSelected] = useState(orderTypes[0]?.type || '');
  const [orderTypeId, setOrderTypeId] = useState(orderTypes[0]?.id || null);

  const [brancheId, setBrancheId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState('');
  const [canNavigate, setCanNavigate] = useState(false);

  // 1. Fetch products AFTER valid selection
  const key = brancheId ? 'branch_id' : 'address_id';
  const value = brancheId || locationId;

  const {
    refetch: refetchProducts,
    loading: loadingProducts,
    data: dataProducts
  } = useGet({
    url: `https://Lamadafoodbcknd.food2go.online/customer/home/web_products?${key}=${value}&locale=${selectedLanguage}`,
    skip: !value // only fetch when value exists
  });

  useEffect(() => {
    if (value && value !== '') {
      dispatch(setPickupLoctaion(value));
      refetchProducts(); // call after valid selection
    }
  }, [value, selectedLanguage, refetchProducts, dispatch]);

  useEffect(() => {
    if (dataProducts && value !== '') {
      dispatch(setTaxType(dataProducts?.tax || null));
      dispatch(setProducts(dataProducts?.products || null));
      dispatch(setProductsFilter(dataProducts?.products || null));
      dispatch(setCategories(dataProducts?.categories || null));
      dispatch(setProductsDiscount(dataProducts?.discounts || null));
      dispatch(setProductsDiscountFilter(dataProducts?.discounts || null));
      setCanNavigate(true); // allow navigation after setting products
    }
  }, [dataProducts, dispatch]);

  // 2. Handle delivery type logic + redirect to login if not authenticated
  useEffect(() => {
    if ((orderTypeSelected === 'delivery' || orderTypeId === 3) && !auth.user) {
      navigate('/auth/login', { replace: true });
    }
  }, [orderTypeSelected, orderTypeId, auth.user]);


  // 4. Selection Handlers
  const handleSelectBranch = (branch) => {
    setBrancheId(branch.id);
    setDeliveryPrice('');
    setLocationId('');
  };

  const handleSelectLocation = (location) => {
    setLocationId(location.id);
    setDeliveryPrice(location?.zone?.price || '');
    setBrancheId('');
  };

  // 3. Centralized function to navigate only when valid
  useEffect(() => {
    if (canNavigate && !loadingProducts && (brancheId || locationId)) {
      navigate("/menu");
    }
  }, [canNavigate, brancheId, locationId]);

  useEffect(() => {
    if (orderTypes.length > 0) {
      console.log("orddd", orderTypes);
      setOrderTypeSelected(orderTypes[0].type);
      setOrderTypeId(orderTypes[0].id);
    }
  }, [orderTypes]);

  //   useEffect(() => {
  //     if ((orderTypeSelected === 'delivery' || orderTypeId === 3) && !auth.user) {  
  //             navigate('/auth/login', { replace: true })
  //      }    
  //     }, [orderTypeSelected,orderTypeId]);

  useEffect(() => { console.log('locations', allLocations) }, [allLocations]);
  useEffect(() => { console.log('orderTypeSelected', orderTypeSelected) }, [orderTypeSelected]);
  useEffect(() => { console.log('orderTypeId', orderTypeId) }, [orderTypeId]);
  useEffect(() => { console.log('brancheId', brancheId) }, [brancheId]);
  useEffect(() => { console.log('allLocations', allLocations) }, [allLocations]);

  useEffect(() => {
    dispatch(UpdateOrder({
      ...order,
      order_type: orderTypeSelected,
      branch_id: brancheId,
      address_id: locationId,
      delivery_price: deliveryPrice,
      amount: Number(total) + Number(deliveryPrice || 0),
    }));
  }, [orderTypeId, brancheId, locationId]);

  const handleAddAddress = () => {
    navigate("/check_out/add_address"); // Update with your actual route
  };

  const handleOpenDelete = (item) => {
    setOpenDelete(item);
  };
  const handleCloseDelete = () => {
    setOpenDelete(null);
  };

  // Delete location and then refetch locations
  const handleDelete = async (id, name) => {
    const success = await deleteData(`https://Lamadafoodbcknd.food2go.online/customer/address/delete/${id}`, `${name} Deleted Success.`);
    if (success) {
      // Filter out the deleted location and update the Redux state
      const updatedLocations = allLocations.filter(location => location.id !== id);
      dispatch(setLocations(updatedLocations));
    }
  };

  if (loadingProducts) {
    return <StaticSpinner />
  }

  return (
    <>
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
                            ${orderTypeSelected === type.type ? 'text-mainColor border-mainColor hover:border-[#F6E7E7] bg-white hover:bg-[#F6E7E7] hover:text-mainColor' : 'text-mainColor bg-[#F6E7E7] border-[#F6E7E7]'}`}
                    onClick={() => {
                      setOrderTypeSelected(type.type);
                      setOrderTypeId(type.id);
                    }}
                  >
                    {/* Display appropriate icon based on type */}
                    {/* errorre */}
                    {type.type.charAt(0).toUpperCase() + type.type.slice(1) === "Delivery" ? (
                      <>
                        <MdDeliveryDining size={64} />
                        <span>{t("Delivery")}</span>
                      </>
                    ) : null}

                    {type.type.charAt(0).toUpperCase() + type.type.slice(1) === "Take_away" ? (
                      <>
                        <GiMeal size={64} />
                        <span>{t("Take_away")}</span>
                      </>
                    ) : null}
                    {/* change langunge
                        {type.type.charAt(0).toUpperCase()+ type.type.slice(1) === "Delivery" ? <MdDeliveryDining size={64} /> : null}
                        {type.type.charAt(0).toUpperCase()+ type.type.slice(1) === "Take_away" ? <GiMeal size={64} /> : null}

                        {type.type.charAt(0).toUpperCase() + type.type.slice(1)} */}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center w-full gap-5 lg:w-1/2 gap-x-3">
            {/* Add New Address button */}
            {/* {orderTypeId === 3 && (
            <div className='flex justify-center w-full'>
                <AddButton handleClick={handleAddAddress} text="Add New Address" BgColor='mainColor' Color='white' iconColor='white' />
            </div>
            )} */}

            {/* Locations */}
            {orderTypeId === 3 && (
              <>
                <h1 className='text-2xl font-semibold'>{t("SelectAddress")}</h1>
                <div className='flex justify-end w-full'>
                  <AddButton handleClick={handleAddAddress} text={t("AddNewAddress")} Color='mainColor' iconColor='mainColor' />
                </div>
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                  {allLocations.map((location) => (
                    <div key={location.id} className="relative">
                      <div
                        onClick={() => {
                          handleSelectLocation(location);
                        }}
                        className={`group w-full flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm 
                            ${locationId === location.id
                            ? 'bg-mainColor text-white '
                            : 'bg-gray-100 text-black hover:bg-mainColor hover:text-white hover:border-mainColor'}`}
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
                            {location.address?.charAt(0).toUpperCase() + location.address?.slice(1)}
                          </p>
                          <p className="text-xs line-clamp-1">
                            <strong>{t("Bldg")}:</strong> {location.building_num || '-'} &nbsp; | &nbsp;
                            <strong>{t("Floor")}:</strong> {location.floor_num || '-'} &nbsp; | &nbsp;
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

            {/* Branches */}
            {(orderTypeId === 1 || orderTypeId === 2) && (
              <div className="flex flex-col items-start w-full gap-3 justify-evenly">
                <h1 className='text-2xl font-semibold'> {t("SelectBranch")}</h1>
                <div className="w-full max-h-[400px] overflow-y-auto flex flex-col gap-3">
                  {allBranches.map((branche) => (
                    <div
                      key={branche.id}
                      className={`w-full flex items-center justify-start gap-x-3 text-xl font-TextFontRegular px-3 py-3 rounded-xl cursor-pointer transition-all ease-in-out duration-300
                    ${brancheId === branche.id ? 'text-white bg-mainColor ' : 'text-black bg-gray-100 hover:bg-mainColor hover:text-white'}`}
                      onClick={() => {
                        handleSelectBranch(branche);
                      }}
                    >
                      <img
                        src={branche?.image_link || ''}
                        alt={branche?.name || 'Branch Image'}
                        className={`w-14 h-14 md:w-20 md:h-20 rounded-full object-cover object-center`}
                      />
                      <div className="flex flex-col items-start justify-center">
                        <span className='sm:text-lg xl:text-xl font-TextFontRegular'>
                          {branche.name.charAt(0).toUpperCase() + branche.name.slice(1)}
                        </span>
                        <span className='sm:text-xs xl:text-lg font-TextFontRegular'>
                          {branche.address.charAt(0).toUpperCase() + branche.address.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 
        <div className="flex items-center justify-center w-full">
                {(brancheId || locationId) && (
            <div>
                <SubmitButton handleClick={GoToMenu} text={'Done'} px="px-20" />
            </div>
        )}

        </div> */}
      </div>
    </>
  );
};

export default LandingPage;
