import React, { useEffect, useState } from "react";
import "./Bookpdfdetails.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getSingleBookpdfAction } from "../../redux/actions/bookpdfAction";
import qr_image from "./qr_image.jpg";
import { register } from "../../redux/actions/userAction";
import Samplepdf from "./Samplepdf";
import { BASE_URL } from "../BaseUrlContanst/Baseurlconstant";

const UserInputForm = () => {
  const dispatch = useDispatch();
  const { bookpdf_id } = useParams();

  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [upiId, setUpiId] = useState("");

  const { user, loading: userLoading } = useSelector((state) => state.user);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMobileNumberChange = (event) => {
    setMobileNumber(event.target.value);
  };

  const handleUpiIdChange = (event) => {
    setUpiId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const myForm = new FormData();

    if (!email && !mobileNumber) {
      alert("Please enter either email or mobile number.");
      return;
    }

    myForm.set("upiId", upiId);
    myForm.set("email", email);
    myForm.set("mobileNumber", mobileNumber);
    myForm.set("bookpdf_id", bookpdf_id);

    dispatch(register(myForm));
  };

  useEffect(() => {
    if (userLoading === false && user && user.createdAt) {
      alert(
        "Successfull, now wait for 10 minutes, you will get an email with link of pdf, if your payment is valid!"
      );
      window.location.reload();
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <span className="or">or</span>
      <input
        type="tel"
        placeholder="Enter your mobile number"
        value={mobileNumber}
        onChange={handleMobileNumberChange}
      />
      <input
        type="text"
        placeholder="Enter Upi Id"
        value={upiId}
        onChange={handleUpiIdChange}
        required
        title="This will you get from your upi payment gateway"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

const Bookpdfdetails = () => {
  const dispatch = useDispatch();
  const { bookpdf_id } = useParams();

  const { getsinglebookpdf, loading: getsinglebookpdfLoading } = useSelector(
    (state) => state.getsinglebookpdf
  );

  const checkoutHandler = async () => {
    const {
      data: { key },
    } = await axios.get(`${BASE_URL}/api/v1/getkey`);

    const myForm = new FormData();
    myForm.set("amount", 5);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/api/v1/checkout`,
      myForm,
      config
    );

    const razorpayInstanceOrders_id = data.razorpayInstanceOrders.id;

    console.log(
      "`${BASE_URL}/api/v1/paymentverification/${bookpdf_id}`",
      `${BASE_URL}/api/v1/paymentverification/${bookpdf_id}`
    );

    const options = {
      key,
      amount: 500,
      currency: "INR",
      name: "Yogesh Dhangar",
      description: "BookStore Payment",
      image: "https://avatars.githubusercontent.com/u/25058652?v=4",
      order_id: razorpayInstanceOrders_id,
      callback_url: `${BASE_URL}/api/v1/paymentverification/${bookpdf_id}`,
      prefill: {
        name: "Yogesh Dhangar",
        email: "vijay45155@gmail.com",
        contact: "9165607505",
      },
      notes: {
        address:
          "Village Chakeri, Tehsil Anjad, District Barwani, Madhya Pradesh, India",
      },
      theme: {
        color: "#121212",
      },
    };

    console.log("options", options);
    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    dispatch(getSingleBookpdfAction(bookpdf_id));
  }, [dispatch, bookpdf_id]);

  return (
    <div className="productdetails_and_payment_container">
      <div className="productdetails_card_container">
        {getsinglebookpdfLoading === false && (
          <div className="productdetails_card">
            <img src={getsinglebookpdf.image} alt={getsinglebookpdf.name} />
            <h2 className="productdetails_name">{getsinglebookpdf.name}</h2>
            <h2 className="productdetails_price">
              Price: ₹{getsinglebookpdf.price}
            </h2>
            <p className="productdetails_description">
              {getsinglebookpdf.description.slice(0, 80) + "..."}
            </p>
            <Samplepdf sample_pdf_url={getsinglebookpdf.sample_pdf_url} />
          </div>
        )}
      </div>
      <div className="payment_container">
        <div className="qr_and_form">
          <img className="qr_image" src={qr_image} alt="QR Code" />
          <UserInputForm bookpdf_id={bookpdf_id} />
        </div>
        <h2 className="note">
          After 10 minutes of your payment, you will receive an email link where
          you can download the full version book PDF. Don't forget to enter your
          email and upi_id.
        </h2>
        <h3>You can pay from any payment gateway!</h3>
      </div>
      <div className="razorpay_download">
        <h3 className="razorpay_download_note">
          Or Click here to donwload instantly
        </h3>
        <Link onClick={checkoutHandler}>Pay To Download</Link>
      </div>
    </div>
  );
};

export default Bookpdfdetails;
