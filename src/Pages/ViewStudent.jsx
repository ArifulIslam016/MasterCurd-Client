import axios, { all } from "axios";
import React, { useEffect, useRef, useState } from "react";
import instance from "../Components/contexts/Instance";
import { MdDeleteSweep } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import modal from "daisyui/components/modal";

export default function ViewStudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const { register, handleSubmit, reset } = useForm({
    defaultValues: selectedStudent,
  });
  const [studentsData, setStudentsData] = useState([]);
  const modalRef = useRef();

  const [skillsArray, setSkillsArray] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [skillError, setSkillError] = useState("");

  useEffect(() => {
    const studentInfo = async () =>
      await instance
        .get("/getStudents")
        .then((res) => setStudentsData(res.data))
        .catch((err) => console.log(err));
    studentInfo();
  }, [studentsData]);

  useEffect(() => {
    if (selectedStudent) {
      reset(selectedStudent);
      setSkillsArray(Array.isArray(selectedStudent.skills) ? selectedStudent.skills : []);
      setSkillInput("");
      setSkillError("");
      console.log("Selected Student:", skillsArray);
    }
  }, [selectedStudent, reset]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill !== "") {
      if (!skillsArray.includes(trimmedSkill)) {
        setSkillsArray([...skillsArray, trimmedSkill]);
        setSkillInput("");
        setSkillError("");
      } else {
        setSkillError("Skill already added!");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsArray(skillsArray.filter((skill) => skill !== skillToRemove));
  };

  const handleDelete = async (id) => {
    const res = await instance.delete(`deleteStudent/${id}`);
    if (res.data.deletedCount) {
      alert("Student Info Deleted Succesfully");
    }
  };

  const handleEdit = async (student) => {
    setSelectedStudent(student);
    modalRef.current.showModal();
  };

  const handleFormSubmit = async (e) => {
    if (skillsArray.length === 0) {
      setSkillError("Skills are required");
      return;
    }

    const formattedData = {
      studentName: e.studentName,
      studentImage: e.studentImage,
      studentAge: Number(e.studentAge),
      skills: skillsArray,
      isRegular: Boolean(e.isRegular),
      department: e.Department[0].department,
      deptCode: Number(e.Department[0].deptCode),
      courseName: e?.course?.[0]?.courseName,
      courseFee: Number(e?.course?.[0]?.courseFee),
      address: {
        presentAddress: e.address.presentAddress,
        city: e.address.city,
        zipCode: Number(e.address.zipCode),
      },
    };

    const updateResult = await instance.patch(
      `/updateStudent/${e._id}`,
      formattedData
    );

    if (updateResult.data.StudentRes.modifiedCount) {
      modalRef.current.close();
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Student Directory
            </h1>
            <p className="text-sm text-gray-500">
              Total Registered Students: {studentsData.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsData.map((student) => {
            const dept = student.Department && student.Department[0];
            const course = student.course && student.course[0];

            return (
              <div
                key={student._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 flex items-start gap-4">
                  <img
                    src={student.studentImage}
                    alt={student.studentName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/20 bg-gray-100"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${student.studentName}`;
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg text-gray-900 leading-none">
                        {student.studentName}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          student.isRegular
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {student.isRegular ? "Regular" : "Irregular"}
                      </span>
                      <div className="flex space-x-1 ml-1 md:ml-2 lg:ml-4">
                        <div
                          onClick={() => handleEdit(student)}
                          className="btn text-green-400 cursor-pointer"
                        >
                          <FaUserEdit />
                        </div>
                        <div
                          onClick={() => handleDelete(student._id)}
                          className="btn text-red-500 cursor-pointer"
                        >
                          <MdDeleteSweep />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Age: {student.studentAge} Years
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.skills &&
                        student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-gray-50/50 border-t border-b grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block font-medium">
                      DEPARTMENT
                    </span>
                    <span className="text-gray-700 font-semibold truncate block">
                      {dept ? `${dept.department} (${dept.deptCode})` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium">
                      COURSE
                    </span>
                    <span className="text-gray-700 font-semibold truncate block">
                      {course ? course.courseName : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between mt-auto">
                  <div className="text-xs text-gray-500 max-w-[60%]">
                    <span className="font-semibold text-gray-700 block">
                      Address
                    </span>
                    <p className="truncate">
                      {student.address
                        ? `${student.address.presentAddress}, ${student.address.city}`
                        : "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-bold tracking-wider">
                      COURSE FEE
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {course
                        ? `${course.courseFee.toLocaleString()} TK`
                        : "0 TK"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Student Info!</h3>
          {selectedStudent && (
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-3 mt-4">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <input
                      {...register("studentName")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. MD Ariful Islam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Age
                    </label>
                    <input
                      {...register("studentAge")}
                      type="number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. 21"
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                {skillsArray.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center shadow-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (Type & Press Enter/Add)
                    </label>

                 

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill(e);
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                        placeholder="e.g. JavaScript"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 font-medium text-sm"
                      >
                        Add
                      </button>
                    </div>

                    {skillError && (
                      <p className="text-red-500 text-xs font-medium mt-1">
                        {skillError}
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
                      Student Image URL
                    </label>
                    <input
                      {...register("studentImage")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="Paste Image URL"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  Address Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Present Address
                    </label>
                    <input
                      {...register("address.presentAddress")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. Mohammadpur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register("address.city")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. Dhaka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      {...register("address.zipCode")}
                      type="number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. 1207"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-3">
                  Department Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      {...register("Department[0].department")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Code
                    </label>
                    <input
                      {...register("Department[0].deptCode")}
                      type="number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. 54"
                    />
                  </div>
                </div>
              </div>

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
                      {...register("course[0].courseName")}
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. Advanced MERN Stack"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Fee
                    </label>
                    <input
                      {...register("course[0].courseFee")}
                      type="number"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
                      placeholder="e.g. 15000"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-action border-t pt-4 mt-6">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm text-gray-500"
                  onClick={() => modalRef.current.close()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white px-6"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}