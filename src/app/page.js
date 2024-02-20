"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import html2canvas from "html2canvas";
export default function Home() {
  const [previewUrl, setPreviewUrl] = useState("https://iili.io/JEAhwvf.jpg");
  const [image, setImage] = useState(null);
  const [returnUrl, setReturnUrl] = useState(null);
  const [totalGrain, setTotalGrain] = useState(null);
  const [individualCount, setIndividualCount] = useState(null);
  const [isLoading,setIsLoading] = useState(false);

  const instanceIdMap = {
    "Instance 0": "Ignore",
    "Instance 1": "Illiminite",
    "Instance 2": "Kynite-0",
    "Instance 3": "Kynite-45",
    "Instance 4": "Quartz-color",
    "Instance 5": "Quartz-colorless",
    "Instance 6": "Rutile-0",
    "Instance 7": "Rutile-90",
    "Instance 8": "Silm-0",
    "Instance 9": "Silm-40",
    "Instance 10": "Silm-60",
    "Instance 11": "Silm-90",
    "Instance 12": "Zircoin",
  };


  const handleDownloadImage = () => {
    const modalContent = document.getElementById("modalContent");
    const imageElement = document.querySelector("#modalContent img");
  
    // Check if the image has loaded
    if (imageElement.complete) {
      // If the image has already loaded, proceed with capturing the modal
      captureModal(modalContent);
    } else {
      // If the image is still loading, wait for it to load before capturing the modal
      imageElement.onload = () => {
        captureModal(modalContent);
      };
    }
  };
  
  const captureModal = (modalContent) => {
    html2canvas(modalContent, { backgroundColor: "#121417" }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = imgData;
      downloadLink.download = 'segmentation_result.png';
      downloadLink.click();
    });
  };
  
  

  //Modal

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");

  const handleOpen = () => {
    onOpen();
  };

  function onImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const onUploadClick = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }
    setIsLoading(true);
    setReturnUrl(null);
    const formData = new FormData();
    formData.append("image", image );
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      handleOpen();
      console.log("File uploaded successfully:", response.data);
      setReturnUrl(response.data.processedImageURL);
      setTotalGrain(response.data.numInstances);
      setIndividualCount(response.data.instanceCounts);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error
    }
  };
  return (
    <>
      <NextUIProvider>
        <main className=" flex min-h-screen flex-col items-center sm:text-red-500 lg:text-white" >
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
              <input
                type="file"
                id="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
              <label
                for="file"
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
                <span>Upload Image</span>
              </label>
            </div>

            <div className=" flex  justify-end px-5">
              <button
                onClick={onUploadClick}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl"
              >
              {isLoading && <Spinner color="default"/>}

              {!isLoading && <><FontAwesomeIcon icon={faLink} />
                <span>Submit</span></>}
                
              </button>
            </div>

            {/* Modal Section */}

            <Modal
              size="3xl"
              backdrop={backdrop}
              isOpen={isOpen}
              onClose={onClose}
              className=" bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100"
            >
              <ModalContent >
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Segmentation Result
                    </ModalHeader>
                    <ModalBody className="flex flex-row gap-5"id="modalContent">
                      <div className="w-3/4 flex items-center">
                        <img src={"http://127.0.0.1:5000" + returnUrl} />
                      </div>
                      <div>
                        <table className="border-1">
                          <tbody className="border-1">
                            <tr className="border-1">
                              <th className="font-bold text-xl border-1">
                                Total Grain
                              </th>
                              <td className="text-xl border-1 p-5">
                                {totalGrain}
                              </td>
                            </tr>
                            <tr className="border-1">
                              <th className="font-bold text-xl p-5" colSpan="2">
                                Individual Count
                              </th>
                            </tr>
                            {Object.keys(individualCount).map((instance) => (
                              <tr
                                key={instance}
                                className="font-semibold border-1"
                              >
                                <td className="border-1 p-5">
                                  {instanceIdMap[instance]}
                                </td>
                                <td className="border-1 p-5">
                                  {individualCount[instance]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={handleDownloadImage}>
                        Download
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </main>
      </NextUIProvider>
    </>
  );
}
