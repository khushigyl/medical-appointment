import convertTime from "../../utils/convertTime";
import { BASE_URL } from "./../../config";
import { toast } from "react-toastify";
const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const bookingHandler = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message + "Please try again");
      }

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    (timeSlots!= undefined && <>
    <div className={"shadow-panelShadow p-3 lg:p-5 rounded-md"}>
      <div className={"flex items-center justify-between"}>
        <p className={"text_para font-semibold mt-0"}>Ticket Price</p>
        <span
          className={
            "text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold"
          }
        >
          {ticketPrice} Rs.
          
        </span>
      </div>

      <div className={"mt-[30px]"}>
        <p className={"text_para mt-0 font-semibold text-headingColor"} >
          Available Time Slots:
        </p>
        {timeSlots.length != 0 ? <div><ul className={"mt-3"}>
          {timeSlots.map((item, index) => (
            <li
              key={index}
              className={"flex items-center justify-between mb-2"}
            >
              <p
                className={"text-[15px] leading-6 font-semibold text-textColor"}
              >
                {item.split(' ')[0]}
              </p>
              <p
                className={"text-[15px] leading-6 font-semibold text-green-400"}
              >
                {convertTime(item.split(' ')[1])} PM -
                {convertTime(item.split(' ')[4])} PM
              </p>
            </li>
          ))}
          
          {/* <li>{timeSlots[0]}</li>
          <li>{timeSlots[1]}</li> */}
        </ul> 
        <button onClick={bookingHandler} className={"btn px-2 w-full rounded-md"}>
        Book Appointment
      </button>
</div>
        
        
        :
          <ul>
            <p className={"text-[15px] leading-6 font-semibold text-red-500  "}>No Slots Available</p>
            </ul>}
      </div>
    </div>
    </>)
  );
};

export default SidePanel;
