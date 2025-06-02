import React, { useEffect, useState } from 'react'
import { FiHome } from "react-icons/fi";
import { MdWork } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import { UpdateOrder } from '../../../Store/CreateSlices';
import AddButton from '../../../Components/Buttons/AddButton';
import { useNavigate, Link } from 'react-router-dom';
import { useDelete } from '../../../Hooks/useDelete';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { PiWarningCircle } from "react-icons/pi";
import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook

// Import your fetchLocations thunk action
import { setLocations } from '../../../Store/CreateSlices';
const Locations = () => {
  const { t, i18n } = useTranslation(); // <-- use i18n to change language
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (orderTypes.length > 0) {
      console.log("orddd", orderTypes);
      setOrderTypeSelected(orderTypes[0].type);
      setOrderTypeId(orderTypes[0].id);
    }
  }, [orderTypes]);

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
    navigate("add_address"); // Update with your actual route
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
     

  return (
    <>
      <div className="w-full flex flex-col border-mainColor border-[3px] gap-y-4 rounded-2xl p-3">
        {/* Navbar Type Order */}
        <div className="flex items-center justify-center w-full gap-x-3">
          {orderTypes.map((type) => (
            type.status === 1 && (
              <span
                key={type.id}
                className={`text-xl font-TextFontRegular px-3 py-2 rounded-full cursor-pointer border-2 border-mainColor transition-all ease-in-out duration-300
                  ${orderTypeSelected === type.type ? 'text-white bg-mainColor ' : 'text-mainColor bg-white hover:bg-mainColor hover:text-white'}`}
                onClick={() => {
                  setOrderTypeSelected(type.type);
                  setOrderTypeId(type.id);
                }}
              >
                {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
              </span>
            )
          ))}
        </div>

        {/* Add New Address button */}
        {orderTypeId === 3 && (
          <div className='flex justify-center w-full'>
            <AddButton handleClick={handleAddAddress} text="Add New Address" BgColor='mainColor' Color='white' iconColor='white' />
          </div>
        )}

        {/* Locations */}
        {orderTypeId === 3 && (
          <>
            {/* Stylish Heading */}
            <h2 className="relative mb-6 text-3xl font-extrabold">
              <span className="inline-block px-4 pb-2 border-b-4 text-mainColor from-mainColor to-secondaryColor border-mainColor">
                {t("SelectAddress")}
              </span>
            </h2>
            {/* Responsive Grid */}
            <div className="grid w-full max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
              {allLocations.map((location) => (
                <div key={location.id} className="relative">
                  {/* Address Card */}
                  <div
                    className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-md border 
                      ${locationId === location.id 
                        ? 'bg-mainColor text-white' 
                        : 'bg-white text-mainColor border-mainColor hover:bg-mainColor hover:text-white'}`}
                    onClick={() => {
                      setLocationId(location.id);
                      setBrancheId('');
                      setDeliveryPrice(location?.zone?.price || '');
                    }}
                  >
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      {location.type === 'Home' ? (
                        <FiHome className="w-10 h-10" />
                      ) : (
                        <MdWork className="w-10 h-10" />
                      )}
                    </div>
                    {/* Details Section */}
                    <div className="flex flex-col space-y-1 overflow-hidden text-sm h-36">
                      <span className="line-clamp-2">
                        <strong>{t("Address")}:</strong> {location.address.charAt(0).toUpperCase() + location.address.slice(1)}
                      </span>
                      <span className="truncate">
                        <strong>{t("Building")}:</strong> {location.building_num.charAt(0).toUpperCase() + location.building_num.slice(1)}
                      </span>
                      <span className="truncate">
                        <strong>{t("Floor")}:</strong> {location.floor_num.charAt(0).toUpperCase() + location.floor_num.slice(1)}
                      </span>
                      <span className="truncate">
                        <strong>{t("Apt")}:</strong> {location.apartment.charAt(0).toUpperCase() + location.apartment.slice(1)}
                      </span>
                      <span className="line-clamp-1">
                        <strong>{t("Extra")}:</strong> {location.additional_data.charAt(0).toUpperCase() + location.additional_data.slice(1)}
                      </span>
                      {/* Action Section inside Details */}
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                        <span className="text-xs font-semibold">{t("Action")}:</span>
                        <div className="flex items-center gap-3">
                          {/* <Link to={`edit/${location.id}`} className="transition-colors hover:text-green-600">
                            <FaEdit size="24" />
                          </Link> */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDelete(location.id);
                            }}
                            className="transition-colors hover:text-red-600"
                          >
                            <MdDelete size="24" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Delete Confirmation Dialog */}
                  {openDelete === location.id && (
                    <Dialog
                      open={true}
                      onClose={handleCloseDelete}
                      className="relative z-10"
                    >
                      <DialogBackdrop className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                          <DialogPanel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="flex flex-col items-center justify-center px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                              <PiWarningCircle size="60" />
                              <div className="mt-2 text-center">
                               {t(" Youwilldeletelocation")} {location?.address || "-"}
                              </div>
                            </div>
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                className="inline-flex justify-center w-full px-6 py-3 text-sm font-semibold text-white rounded-md shadow-sm bg-mainColor sm:ml-3 sm:w-auto"
                                onClick={() => handleDelete(location.id, location?.address)}
                              >
                                {t("Delete")}
                              </button>
                              <button
                                type="button"
                                data-autofocus
                                onClick={handleCloseDelete}
                                className="inline-flex justify-center w-full px-6 py-3 mt-3 text-sm font-medium text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
                              >
                                {t("Close")}
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
          <div className="flex flex-wrap items-start w-full gap-3 justify-evenly">
            {allBranches.map((branche) => (
              <div
                key={branche.id}
                className={`sm:w-full lg:w-5/12 flex items-center justify-start gap-x-2 text-xl font-TextFontRegular px-3 py-2 rounded-xl cursor-pointer border-2 border-mainColor transition-all ease-in-out duration-300
                  ${brancheId === branche.id ? 'text-white bg-mainColor ' : 'text-mainColor bg-white hover:bg-mainColor hover:text-white'}`}
                onClick={() => {
                  setBrancheId(branche.id);
                  setDeliveryPrice('');
                  setLocationId('');
                }}
              >
                <img
                  src={branche?.image_link || ''}
                  alt={branche?.name || 'Branch Image'}
                  className={`w-20 h-20 rounded-full ${brancheId === branche?.id ? 'border-2 border-white' : 'border-2 border-mainColor'} object-cover object-center`}
                />
                <div className="flex flex-col items-start justify-center">
                  <span className='sm:text-2xl xl:text-3xl font-TextFontMedium'>
                    {branche.name.charAt(0).toUpperCase() + branche.name.slice(1)}
                  </span>
                  <span className='sm:text-xl xl:text-2xl font-TextFontRegular'>
                    {branche.address.charAt(0).toUpperCase() + branche.address.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Locations;
