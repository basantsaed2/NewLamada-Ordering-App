// // import { InputTextarea } from 'primereact/inputtextarea';
// // import React, { useEffect, useState } from 'react'
// // import { Checkbox, TimeInput } from '../../../Components/Components';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { UpdateOrder } from '../../../Store/CreateSlices';

// // const DetailsOrder = () => {

// //        const dispatch = useDispatch();
// //        const order = useSelector(state => state?.order?.data || {});

// //        const [note, setNote] = useState('');
// //        const [deliveryTime, setDeliveryTime] = useState('');
// //        const [checkedTimeNow, setCheckedTimeNow] = useState(false);

// //        const handleDeliveryTime = (e) => {
// //               const time = e.target.value;
// //               const [hour, minute, second = '00'] = time.split(':').map(Number);
// //               if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
// //                      console.error('The specified value "' + time + '" does not conform to the required format.');
// //                      return;
// //               }
// //               setCheckedTimeNow(false);
// //               setDeliveryTime(time);
// //               console.log(time);
// //        };

// //        const handleCheckedTimeNow = () => {
// //               const time = new Date();
// //               const hour = String(time.getHours()).padStart(2, '0');
// //               const minute = String(time.getMinutes()).padStart(2, '0');
// //               const second = String(time.getSeconds()).padStart(2, '0');

// //               setCheckedTimeNow(!checkedTimeNow);
// //               setDeliveryTime(`${hour}:${minute}:${second}`);
// //               console.log(`${hour}:${minute}:${second}`);
// //        };

// //        useEffect(() => {
// //               dispatch(UpdateOrder({ ...order, notes: note, date: deliveryTime }))
// //        }, [note, deliveryTime])

// //        return (
// //               <>
// //                      <div className="w-full flex sm:flex-col xl:flex-row items-center justify-between gap-5 border-mainColor border-[3px] rounded-2xl p-3">
// //                             <div className="flex flex-col items-start justify-start gap-1 sm:w-full xl:w-6/12">
// //                                    <span className="mb-2 text-3xl text-secoundColor font-TextFontRegular">
// //                                           Note
// //                                    </span>
// //                                    <InputTextarea
// //                                           placeholder="Your Note ..." rows={4} cols={30}
// //                                           className="w-full p-2 mt-2 text-xl border-2 outline-none border-secoundColor rounded-xl focus:border-mainColor text-secoundColor sm:font-TextFontRegular xl:font-TextFontMedium"
// //                                           unstyled
// //                                           value={note}
// //                                           onChange={(e) => setNote(e.target.value)}
// //                                    />

// //                             </div>
// //                             <div className="flex flex-col items-start justify-center gap-3 sm:w-full xl:w-6/12">
// //                                    {/* <span className="mb-2 text-3xl text-secoundColor font-TextFontRegular">
// //                                           Contact information
// //                                    </span>
// //                                    <div className="">


// //                                    </div> */}
// //                                    <div className="flex items-center justify-between w-full gap-2">
// //                                           <span className='w-4/12 text-2xl text-secoundColor font-TextFontRegular'>Delivery Time:</span>
// //                                           <TimeInput
// //                                                  value={deliveryTime}
// //                                                  onChange={handleDeliveryTime}
// //                                           />
// //                                    </div>

// //                                    <div className="flex items-center justify-end w-full">
// //                                           <Checkbox
// //                                                  handleChecked={handleCheckedTimeNow}
// //                                                  isChecked={checkedTimeNow}
// //                                           />
// //                                           <span className='mt-3 text-2xl text-secoundColor font-TextFontRegular'>Delivery Now</span>

// //                                    </div>
// //                             </div>
// //                      </div>
// //               </>
// //        )
// // }

// // export default DetailsOrder

// import { useTranslation } from 'react-i18next'; // <-- Importing useTranslation hook
// import { InputTextarea } from 'primereact/inputtextarea';
// import React, { useEffect, useState } from 'react';
// import { Checkbox, TimeInput } from '../../../Components/Components';
// import { useDispatch, useSelector } from 'react-redux';
// import { UpdateOrder } from '../../../Store/CreateSlices';
// import { useGet } from '../../../Hooks/useGet';
// const DetailsOrder = () => {
//     const { refetch: refetchSchedule, loading: loadingSchedule, data: dataSchedule } = useGet({
//         url: 'https://Lamadafoodbcknd.food2go.online/customer/home/schedule_list',
//     });
//     const dispatch = useDispatch();
//     const order = useSelector(state => state?.order?.data || {});

//     // Function to get the current time in HH:MM:SS format
    // const getCurrentTime = () => {
    //     const time = new Date();
    //     return time.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
    // };
//     const { t, i18n } = useTranslation(); // <-- use i18n to change language

//     const [note, setNote] = useState('');
//     const [checkedTimeNow, setCheckedTimeNow] = useState(true);
//     const [deliveryTime, setDeliveryTime] = useState(getCurrentTime());
//     const [scheduleList,setScheduleList] = useState([]);
//     useEffect(() => {
//         refetchSchedule();
//     }, [refetchSchedule]);

//     useEffect(() => {
//         if (dataSchedule && dataSchedule.schedule_list) {
//             console.log('dataSchedule:', dataSchedule);
//             setScheduleList(dataSchedule.schedule_list)
//         }
//     }, [dataSchedule]);

//     // Effect to update time every second when "Delivery Now" is checked
//     useEffect(() => {
//         let timer;
//         if (checkedTimeNow) {
//             timer = setInterval(() => {
//                 setDeliveryTime(getCurrentTime());
//             }, 1000);
//         }
//         return () => clearInterval(timer); // Cleanup when unmounting or unchecking
//     }, [checkedTimeNow]);

//     const handleDeliveryTime = (e) => {
//         setCheckedTimeNow(false); // Uncheck "Delivery Now" if user picks a time
//         setDeliveryTime(e.target.value);
//     };

//     const handleCheckedTimeNow = () => {
//         setCheckedTimeNow(!checkedTimeNow);
//         if (!checkedTimeNow) {
//             setDeliveryTime(getCurrentTime());
//         }
//     };

//     // Update order in Redux
//     useEffect(() => {
//         dispatch(UpdateOrder({ ...order, notes: note, date: deliveryTime }));
//     }, [note, deliveryTime]);

//     return (
//         <>
//             <div className="w-full flex sm:flex-col xl:flex-row items-center justify-between gap-5 border-mainColor border-[3px] rounded-2xl p-3">
//                 <div className="flex flex-col items-start justify-start gap-1 sm:w-full xl:w-6/12">
//                     <span className="mb-2 text-3xl text-secoundColor font-TextFontRegular">
//                         Note
//                     </span>
//                     <InputTextarea
//                         placeholder="Your Note ..." rows={4} cols={30}
//                         className="w-full p-2 mt-2 text-xl border-2 outline-none border-secoundColor rounded-xl focus:border-mainColor text-secoundColor sm:font-TextFontRegular xl:font-TextFontMedium"
//                         unstyled
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                     />
//                 </div>
//                 <div className="flex flex-col items-start justify-center gap-3 sm:w-full xl:w-6/12">
//                     <div className="flex items-center justify-between w-full gap-2">
//                         <span className='w-4/12 text-2xl text-secoundColor font-TextFontRegular'>{t("DeliveryTime")}:</span>
//                         <TimeInput
//                             value={deliveryTime}
//                             onChange={handleDeliveryTime}
//                             disabled={checkedTimeNow} // Disable time input when "Delivery Now" is checked
//                         />
//                     </div>
//                     <div className="flex items-center justify-end w-full">
//                         <Checkbox
//                             handleChecked={handleCheckedTimeNow}
//                             isChecked={checkedTimeNow}
//                         />
//                         <span className='mt-3 text-2xl text-secoundColor font-TextFontRegular'>{t("DeliveryNow")}</span>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default DetailsOrder;

import { useTranslation } from 'react-i18next';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState, useRef } from 'react';
import { TimeInput, DropDown } from '../../../Components/Components';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateOrder } from '../../../Store/CreateSlices';
import { useGet } from '../../../Hooks/useGet';

const DetailsOrder = () => {
    const { refetch: refetchSchedule, data: dataSchedule } = useGet({
        url: 'https://Lamadafoodbcknd.food2go.online/customer/home/schedule_list',
    });
    const dispatch = useDispatch();
    const order = useSelector(state => state?.order?.data || {});
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

    const getCurrentTime = () => {
        const time = new Date();
        return time.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
    };

    const [note, setNote] = useState('');
    const [deliveryTime, setDeliveryTime] = useState(getCurrentTime());
    const [scheduleList, setScheduleList] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [openScheduleMenu, setOpenScheduleMenu] = useState(false);
    const [timeMode, setTimeMode] = useState('schedule'); // 'schedule' or 'custom'

    useEffect(() => {
        refetchSchedule();
    }, [refetchSchedule]);

    useEffect(() => {
        if (dataSchedule?.schedule_list) {
            setScheduleList(dataSchedule.schedule_list);
            const nowOption = dataSchedule.schedule_list.find(item => item.name === 'Now');
            if (nowOption) {
                setSelectedSchedule(nowOption);
                setDeliveryTime(getCurrentTime());
                setTimeMode('schedule');
            }
        }
    }, [dataSchedule]);

    const handleDeliveryTime = (e) => {
        const newTime = e.target.value;
        setDeliveryTime(newTime);
    };

    const handleSelectSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        if (schedule.name === 'Now') {
            setDeliveryTime(getCurrentTime());
        } else {
            setDeliveryTime('');
        }
    };

    const toggleScheduleMenu = () => {
        setOpenScheduleMenu(!openScheduleMenu);
    };

    const handleTimeModeChange = (mode) => {
        setTimeMode(mode);
        if (mode === 'schedule' && scheduleList.length > 0) {
            const nowOption = scheduleList.find(item => item.name === 'Now') || scheduleList[0];
            setSelectedSchedule(nowOption);
            setDeliveryTime(nowOption.name === 'Now' ? getCurrentTime() : '');
        } else if (mode === 'custom') {
            setSelectedSchedule(null);
            setDeliveryTime('');
        }
    };

    const isValidTime = (time) => {
        return /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(time);
    };

    useEffect(() => {
        const payload = { notes: note };
        let shouldUpdate = order.notes !== note;

        // if (timeMode === 'custom' && deliveryTime && isValidTime(deliveryTime)) {
        //     // Format to HH:MM:SS, matching reference code
        //     const formattedTime = deliveryTime.includes(':') && !deliveryTime.includes(':00')
        //         ? `${deliveryTime}:00`
        //         : deliveryTime;
        //     if (order.date !== formattedTime) {
        //         shouldUpdate = true;
        //         payload.date = formattedTime;
        //         payload.sechedule_slot_id = null;
        //     }
            /*
            // Alternative: Send full datetime if HH:MM:SS fails
            const today = new Date().toISOString().slice(0, 10); // "2025-05-15"
            const formattedTime = `${today} ${deliveryTime.includes(':00') ? deliveryTime : `${deliveryTime}:00`}`; // "2025-05-15 14:30:00"
            if (order.date !== formattedTime) {
                shouldUpdate = true;
                payload.date = formattedTime;
                payload.sechedule_slot_id = null;
            }
            */
       if (timeMode === 'schedule' && selectedSchedule) {
            if (order.sechedule_slot_id !== selectedSchedule.id) {
                shouldUpdate = true;
                payload.sechedule_slot_id = selectedSchedule.id;
                // payload.date = null;
            }
        }

        if (shouldUpdate) {
            dispatch(UpdateOrder(payload));
        }
    }, [note, deliveryTime, selectedSchedule, timeMode, order, dispatch]);

    return (
        <div className="w-full flex sm:flex-col xl:flex-row items-start justify-between gap-5 border-[#c3171c] border-[3px] rounded-2xl p-3 bg-white">
            {/* Order Notes */}
            <div className="flex flex-col items-start justify-start gap-1 sm:w-full xl:w-6/12">
                <span className="mb-2 text-3xl text-[#1f2937] font-TextFontRegular">
                    {t('OrderNotes')}
                </span>
                <InputTextarea
                    placeholder={t('AddSpecialInstructions')}
                    rows={4}
                    className="w-full p-2 text-xl border-2 outline-none border-[#1f2937] rounded-xl focus:border-[#c3171c] text-[#1f2937] sm:font-TextFontRegular xl:font-TextFontMedium"
                    unstyled
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            {/* Delivery Time */}
            <div className="flex flex-col items-start justify-start gap-3 sm:w-full xl:w-6/12">
                <span className="text-3xl text-[#1f2937] font-TextFontRegular mb-2">
                    {t('DeliveryTime')}
                </span>
                <div className="flex flex-col w-full gap-4">
                    {/* Radio Buttons */}
                    <div className="flex items-start gap-4 sm:flex-col lg:flex-row">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="timeMode"
                                value="schedule"
                                checked={timeMode === 'schedule'}
                                onChange={() => handleTimeModeChange('schedule')}
                                className="h-5 w-5 text-[#c3171c] focus:ring-[#c3171c] border-[#1f2937]"
                            />
                            <span className="text-xl text-[#1f2937] font-TextFontRegular">
                                {t('ChooseSchedule')}
                            </span>
                        </label>
                        {/* <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="timeMode"
                                value="custom"
                                checked={timeMode === 'custom'}
                                onChange={() => handleTimeModeChange('custom')}
                                className="h-5 w-5 text-[#c3171c] focus:ring-[#c3171c] border-[#1f2937]"
                            />
                            <span className="text-xl text-[#1f2937] font-TextFontRegular">
                                {t('Set Custom Time')}
                            </span>
                        </label> */}
                    </div>

                    {/* Schedule Dropdown */}
                    {timeMode === 'schedule' && (
                        <div className="w-full">
                            <DropDown
                                ref={dropdownRef}
                                handleOpen={toggleScheduleMenu}
                                handleOpenOption={toggleScheduleMenu}
                                openMenu={openScheduleMenu}
                                stateoption={selectedSchedule?.name || t('SelectOption')}
                                options={scheduleList}
                                onSelectOption={handleSelectSchedule}
                                className="w-full p-2 text-xl border-2 outline-none border-[#1f2937] rounded-xl focus:border-[#c3171c] text-[#1f2937] disabled:bg-gray-100 disabled:cursor-not-allowed sm:font-TextFontRegular xl:font-TextFontMedium"
                                disabled={timeMode !== 'schedule'}
                            />
                        </div>
                    )}

                    {/* Time Input
                    {timeMode === 'custom' && (
                        <div className="w-full">
                            <TimeInput
                                value={deliveryTime}
                                onChange={handleDeliveryTime}
                                disabled={timeMode !== 'custom'}
                                className="w-full p-2 text-xl border-2 outline-none border-[#1f2937] rounded-xl focus:border-[#c3171c] text-[#1f2937] disabled:bg-gray-100 disabled:cursor-not-allowed sm:font-TextFontRegular xl:font-TextFontMedium"
                            />
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default DetailsOrder;