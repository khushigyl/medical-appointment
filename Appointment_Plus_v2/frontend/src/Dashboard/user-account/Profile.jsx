import { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
// import uploadImageToCloudinary from "../../utils/uploadCloudinary.js";
import { BASE_URL,token } from "../../config.js";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

import { authContext } from "../../context/AuthContext";

const Profile = ({user}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "data:image/png;base64,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",
    gender: "",
    bloodType: "",
  });

  const navigate = useNavigate();

  useEffect(()=>{
    setFormData({name:user.name, email:user.email, photo:user.photo,gender:user.gender, bloodType:user.bloodType})
  },[2])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { dispatch } = useContext(authContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // const handleFileInputChange = async (event) => {
  //   const file = event.target.files[0];
  //   console.log(file);
  //   const data = await uploadImageToCloudinary(file);
  //   console.log(data);

    
  //   setSelectedFile(data.url);
  //   setFormData({ ...formData, photo: data.url });
  // };

  const submitHandler = async (event) => {
    console.log(formData);
    event.preventDefault();
    setLoading(true);

    try {
      // const salt = await bcrypt.genSalt(10)
      // password = await bcrypt.hash(password, salt)
      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      // navigate("/home");
      handleLogout();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="mt-10">
      <form onSubmit={submitHandler}>
        <div className={"mb-5"}>
          <input
            type={"text"}
            placeholder={"Full Name"}
            name={"name"}
            value={formData.name}
            onChange={handleInputChange}
            className={
              "w-full pr-4 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[14px] leading-7 text-headingColor placeholder:text-textColor cursor:pointer"
            }
            required
          />
        </div>
        <div className={"mb-5"}>
          <input
            type={"email"}
            placeholder={"Enter your email"}
            name={"email"}
            value={formData.email}
            onChange={handleInputChange}
            className={
              "w-full pr-4 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[14px] leading-7 text-headingColor placeholder:text-textColor cursor:pointer"
            }
           arial-readonly
           readOnly
          />
        </div>
        <div className={"mb-5"}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={
              "w-full pr-4 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[14px] leading-7 text-headingColor placeholder:text-textColor cursor:pointer"
            }
            
          />
        </div>
        <div className={"mb-5"}>
          <input
            type="text"
            placeholder="Blood Type"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className={
              "w-full pr-4 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[14px] leading-7 text-headingColor placeholder:text-textColor cursor:pointer"
            }
            required
          />
        </div>

        <div className={"mb-5 flex item-center justify-between"}>
          

          <label
            className={"text-headingColor font-bold text-[14px] leading-7"}
          >
            Gender:
            <select
              name={"gender"}
              value={formData.gender}
              onChange={handleInputChange}
              className={
                "text-textColor font-semibold text-[13px] leading-7 px-4 py-3 focus:outline-none"
              }
            >
              <option value={""}>Select</option>
              <option value={"male"}>Male</option>
              <option value={"female"}>Female</option>
              <option value={"other"}>Other</option>
            </select>
          </label>
        </div>

        <div className={"mb-5 flex item-center gap-3"}>
          {formData.photo && (
            <figure
              className={
                "w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center"
              }
            >
              <img src={formData.photo} alt="" className={"w-full rounded-full"} />
            </figure>
          )}

          {/* <div className={"relative w-[130px] h-[50px]"}>
            <input
              type={"file"}
              name={"photo"}
              id={"customerFile"}
              onChange={handleFileInputChange}
              accept={".jpg, .png"}
              className={
                "absolute top-0 w-full h-full opacity-0 cursor-pointer"
              }
            />
            <label
              htmlFor={"customerFile"}
              className={
                "Absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
              }
            >
              {selectedFile?selectedFile.name:'Upload Photo'}
            </label>
          </div> */}
        </div>

        <div className={"mt-7"}>
          <button
            disabled={loading && true}
            type={"submit"}
            className={
              "w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            }
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update"}
          </button>
        </div>

        
      </form>
    </div>
  );
};

export default Profile;
