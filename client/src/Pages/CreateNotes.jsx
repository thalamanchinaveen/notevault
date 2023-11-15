import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";

axios.defaults.withCredentials = true;

const CreateNotes = () => {
  const { currentUser } = useSelector((state) => state.userSlice);

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [createMessage, setCreateMessage] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    image: [],
    userId: currentUser._id,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError(false);
      formik.setValues({ ...values, userId: currentUser._id });
      const res = await axios.post(
        `${process.env.REACT_APP_HOST_URL}/api/notes/createnotes/${currentUser._id}`,
        values,
        { withCredentials: true }
      );
      setLoading(false);
      setCreateMessage(res.data);
      setError(false);
    } catch (err) {
      setLoading(false);
      setError(err.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });
  const handleImageSubmit = () => {
    if ((files && files.length) + formik.values.image.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      const progressArray = [];
      for (let i = 0; i < files.length; i++) {
        progressArray.push({ file: files[i], progress: 0 });
        promises.push(storeImage(files[i], i, progressArray));
      }

      Promise.all(promises)
        .then((urls) => {
          formik.setFieldValue("image", formik.values.image.concat(urls));
          setImageUploadError(false);
          setUploading(false);
          setUploadProgress([]);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file, index, progressArray) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressArray[index].progress = progress;
          setUploadProgress([...progressArray]);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteImageHandler = (index) => {
    formik.setValues({
      ...formik.values,
      image: formik.values.image.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-500 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-14 mb-10 h-fit">
        <h1 className="text-2xl font-bold mb-4 text-teal-500 uppercase text-center">
          Create Notes
        </h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex mb-4">
            <div className="w-1/4 pr-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
            </div>
            <div className="w-3/4">
              <input
                type="text"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
                  formik.touched.title && formik.errors.title
                    ? "border-red-500"
                    : "border-teal-500"
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm">
                  {formik.errors.title}
                </div>
              )}
            </div>
          </div>

          <div className="flex mb-4">
            <div className="w-1/4 pr-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
            </div>
            <div className="w-3/4">
              <textarea
                id="description"
                name="description"
                className={`w-full px-4 py-2 border-b-2 focus:outline-none ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-teal-500"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              )}
            </div>
          </div>

          <div className="flex mb-4">
            <div className="w-1/4 pr-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
                onClick={handleImageSubmit}
              >
                Upload Image
              </label>
            </div>
            <div className="w-3/4">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className=" text-green-700 border border-green-700 p-3 w-full rounded"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-1 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
          {uploadProgress.map((progress, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="mr-2">{`Image ${index + 1}:`}</span>
              <progress value={progress.progress} max="100" />
              <span className="ml-2">{`${Math.round(
                progress.progress
              )}%`}</span>
            </div>
          ))}
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          <div className="flex mt-3 flex-wrap gap-5 justify-between">
            {formik.values.image.length > 0 &&
              formik.values.image.map((url, index) => (
                <div
                  key={url}
                  className="flex flex-col justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="note"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => deleteImageHandler(index)}
                    className="p-1 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    <MdDelete className="h-5 w-5" />
                  </button>
                </div>
              ))}
          </div>
          <div className="mt-4">
            <button
              disabled={loading || uploading}
              type="submit"
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full"
            >
              {loading ? "Creating..." : "Create Notes"}
            </button>
            {error ? (
              <p className="text-red-700 text-sm mt-3">{error}</p>
            ) : createMessage ? (
              <p className="text-green-700 text-sm mt-3">{createMessage}</p>
            ) : (
              ""
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotes;


