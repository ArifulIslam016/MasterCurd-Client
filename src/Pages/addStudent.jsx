import React from "react";
import { useForm } from "react-hook-form";
import instance from "../Components/contexts/Instance";
import axios from "axios";

const StudentRegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },reset
  } = useForm();
  const handleFormSubmit = async (e) => {
    const ImageBBApi = import.meta.env.VITE_ImageBB_APIKEY;
    // Image uploading here..........
    if (e.studentImage.length > 0) {
      const formData = new FormData();
      formData.append("image", e.studentImage[0]);

      const imageUploadResult = await axios.post(
        `https://api.imgbb.com/1/upload?key=${ImageBBApi}`,
        formData,
      );
      console.log(imageUploadResult.data.data.url);
      const studentData = {
        studentName: e.studentName,
        studentImage: imageUploadResult.data.data.url,
        studentAge: Number(e.studentAge),
        skills: e.skills
          ? e.skills.split(",").map((skill) => skill.trim())
          : [],
        isRegular: Boolean(e.isRegular),
        department: e.department,
        deptCode: Number(e.deptCode),
        courseName: e.courseName,
        courseFee: Number(e.courseFee),
        address: {
          presentAddress: e.presentAddress,
          city: e.city,
          zipCode: Number(e.zipCode),
        },
      };

      const result = await instance.post("/addStudents", studentData);
      if(result.status === 200){
        alert("Student data added successfully!");
        reset()
      } 
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-base-100 shadow-md rounded-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-3">
        Student Registration Form
      </h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            ১. Student Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <input
                {...register("studentName", { required: true,message:"Student Name is required" })}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. MD Ariful Islam"
              />
            </div>
             {errors.studentName && (
        <p className="text-red-500 text-xs font-medium mt-0.5 animate-in fade-in-50 duration-200">
          {errors.studentName.message}
        </p>
      )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Age
              </label>
              <input
                {...register("studentAge", { required: true, min: { value: 1, message: "Enter Valid Age" } })}
                type="number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 21"
              />
               {errors.studentAge && (
        <p className="text-red-500 text-xs font-medium mt-0.5 animate-in fade-in-50 duration-200">
          {errors.studentAge.message}
        </p>
      )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (Comma Separated)
              </label>
              <input
                {...register("skills", { required: true,message:"Skills are required" })}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. JavaScript, React, Node.js"
              />
               {errors.skills && (
        <p className="text-red-500 text-xs font-medium mt-0.5 animate-in fade-in-50 duration-200">
          {errors.skills.message}
        </p>
      )}
            </div>
            <div className="flex items-center h-full mt-5">
              <input
                {...register("isRegular")}
                id="isRegular"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isRegular"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Is Regular Student?
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Image
              </label>
              <input
                {...register("studentImage")}
                type="file"
                accept="image/*"
                className="w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500
                 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        {/* addresss info here,,,,,,,,,,,,,,,,,,,,*/}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            ২. Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Present Address
              </label>
              <input
                {...register("presentAddress", { required: true })}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Mohammadpur"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register("city", { required: true })}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Dhaka"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                {...register("zipCode")}
                type="number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 1207"
              />
            </div>
          </div>
        </div>

        {/* Depertment information here===== */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            ৩. Department Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name
              </label>
              <input
                {...register("department")}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Code
              </label>
              <input
                {...register("deptCode")}
                type="number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 54"
              />
            </div>
          </div>
        </div>
        {/* Course Information  here------------*/}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
             Course Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                {...register("courseName")}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Advanced MERN Stack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Fee
              </label>
              <input
                {...register("courseFee", {
                  min: { value: 1, message: "Enter Valid Amount" },
                })}
                type="number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 15000"
              />
              {errors.courseFee && (
                <p className="text-red-500 text-xs font-medium mt-0.5 animate-in fade-in-50 duration-200">
                  {errors.courseFee.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition duration-200"
          >
            Submit Data to 3 Collections
          </button>
        </div>
      </form>
    </div>
  );
};
export default StudentRegisterForm;
