"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function Home() {
  const [previewUrl,setPreviewUrl] = useState("https://iili.io/JEAhwvf.jpg");
  const [image, setImage] = useState(null);
  const [returnUrl, setReturnUrl] = useState(null);

  function onImageChange(e) {
    const file = e.target.files[0];
    setImage(file)
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }  
    
  }

  const onUploadClick = async()=> {
    if(!image) {
      alert("Please select an image")
      return
    }
    setReturnUrl(null);
    const formData = new FormData();
    formData.append("image", image);
    try{
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
            setReturnUrl(response.data.processedImageURL)
    }catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
  }
  }
  return (
    <>
      <main className="flex min-h-screen flex-col items-center">
        {/* Navbar */}
        <div className=" w-full px-10 py-5  border-b-2 navbar">Spectron</div>

        {/* Main Section */}

        <div className="flex flex-col gap-10 m-5 my-11 max-w-3xl">
          <h1 className="text-5xl text-wrap font-extrabold">
            Classify and segment your microscopic images with Spectron
          </h1>
          <h2 className="text-xl">
            Spectron is a powerful tool for classifying and segmenting your
            microscopic images. Our AI models are pre-trained to recognize 6
            types of minerals.
          </h2>
          <h2 className="text-xl font-semibold">Upload an Image</h2>
          <div className="rounded-xl">
            <img className="w-full rounded-xl" src={previewUrl} />
          </div>
          {/* Upload Button with an icon */}
          <div className=" flex  justify-end px-5">
            <input type="file" id="file" accept="image/*" className="hidden" onChange={onImageChange} />
            <label
              for="file"
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl cursor-pointer"
            >
              <FontAwesomeIcon icon={faArrowUpFromBracket} />
              <span>Upload Image</span>
            </label>
          </div>

          <div className=" flex  justify-end px-5">
            <button onClick={onUploadClick} className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl">
              <FontAwesomeIcon icon={faLink} />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
