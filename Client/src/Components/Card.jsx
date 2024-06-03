import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useUserContext } from "../Context/UserContext";

const Card = () => {
  const [mobile, setMobile] = useState(false);
  const { username, lastname } = useUserContext();

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 1024);
    };
    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!mobile && (
        <>
          <div className="md:mt-0 mt-8">
            <div className="bg-[url('/bg1.jpg')] bg-greenBlue text-white bg-blend-darken p-4 rounded-md w-[350px]">
              <div className="flex gap-5 flex-col">
                <span className="flex items-center justify-between">
                  <small>debit</small>
                  <h5 className="text-sm">Nexus</h5>
                </span>
                <div className="bg-[url('/bg1.jpg')] bg-gamboge bg-center bg-cover bg-blend-darken p-4 rounded-md w-[50px]"></div>
                <h1 className="font-bold tracking-[5px] text-xl">
                  **** **** **** 2574
                </h1>
                <span className="flex items-center justify-between">
                  <h1>{lastname} {username}</h1>
                  <h5 className="text-[8px]">
                    Expires: <br /> 04/25
                  </h5>
                  <img src="/ms.svg" className="w-[30px]" alt="" />
                </span>
              </div>
            </div>
          </div>

          <div className="md:mt-0 mt-8">
            <div className="bg-greenBlue text-white rounded-md p-4 w-[350px]">
              <div className="flex gap-5 flex-col">
                <span className="bg-black w-full h-12"></span>
                <span className="bg-slate-400 w-full flex justify-start italic p-1">
                  ***
                </span>
                <span className="flex items-center justify-between">
                  <h5 className="text-sm">Valid</h5>
                  <FontAwesomeIcon className="text-3xl" icon={faQrcode} />
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {mobile && (
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          className="w-[22em]"
          loop={true}
          autoplay={{ delay: 6000 }}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <div className="md:mt-0 mt-8">
              <div className="bg-[url('/bg1.jpg')] bg-greenBlue text-white bg-blend-darken p-4 rounded-md w-[350px]">
                <div className="flex gap-5 flex-col">
                  <span className="flex items-center justify-between">
                    <small>debit</small>
                    <h5 className="text-sm">Nexus</h5>
                  </span>
                  <div className="bg-[url('/bg1.jpg')] bg-gamboge bg-center bg-cover bg-blend-darken p-4 rounded-md w-[50px]"></div>
                  <h1 className="font-bold tracking-[5px] text-xl">
                    **** **** **** 2574
                  </h1>
                  <span className="flex items-center justify-between">
                    <h1>{lastname} {username}</h1>
                    <h5 className="text-[8px]">
                      Expires: <br /> 04/25
                    </h5>
                    <img src="/ms.svg" className="w-[30px]" alt="" />
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="md:mt-0 mt-8">
              <div className="bg-greenBlue text-white rounded-md p-4 w-[350px]">
                <div className="flex gap-5 flex-col">
                  <span className="bg-black w-full h-12"></span>
                  <span className="bg-slate-400 w-full flex justify-start italic p-1">
                    ***
                  </span>
                  <span className="bg-black invisible w-full h-2"></span>
                  <span className="flex items-center justify-between">
                    <h5 className="text-sm">Valid</h5>
                    <FontAwesomeIcon className="text-3xl" icon={faQrcode} />
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      )}
    </>
  );
};

export default Card;
