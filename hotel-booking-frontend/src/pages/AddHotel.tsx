import { useMutation, } from "react-query";
import {  useQueryClient } from "react-query";

import { useNavigate } from "react-router-dom";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import useAppContext from "../hooks/useAppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({
        title: "Hotel Added Successfully",
        description:
          "Your hotel has been added to the platform successfully! Redirecting to My Hotels...",
        type: "SUCCESS",
      });
  
      // 🔥 MOST IMPORTANT LINE
      queryClient.invalidateQueries(["fetchMyHotels"]);
  
      setTimeout(() => {
        navigate("/my-hotels");
      }, 1500);
    },
  
    onError: () => {
      showToast({
        title: "Failed to Add Hotel",
        description: "There was an error saving your hotel. Please try again.",
        type: "ERROR",
      });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
