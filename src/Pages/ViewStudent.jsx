import axios from "axios";
import React, { useEffect, useState } from "react";
import instance from "../Components/contexts/Instance";
import { MdDeleteSweep } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

export default function ViewStudentsPage() {
  // Apnar backend input theke asha data array format-ti ekhane bosbe
  const [studentsData, setStudentsData] = useState([]);
  useEffect(() => {
    const studentInfo = async () =>
      await instance
        .get("/getStudents")
        .then((res) => setStudentsData(res.data))
        .catch((err) => console.log(err));
    studentInfo();
  }, [studentsData]);

 const handleDelete = async (id) => {   
    console.log('del bn clicekt',id)
 }
 const handleEdit = async (id) => {   
    console.log('edit bn clicekt',id)
 }


  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header section */}
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

      {/* Grid Layout Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentsData.map((student) => {
          // Nested array standard handling safety check
          const dept = student.Department && student.Department[0];
          const course = student.course && student.course[0];

          return (
            <div
              key={student._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Header Profile Section */}
              <div className="p-5 flex items-start gap-4">
                <img
                  src={student.studentImage}
                  alt={student.studentName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/20 bg-gray-100"
                  onError={(e) => {
                    // Image online napaile automatic name variable diye placeholder banaye nibe
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
                      <div onClick={()=>handleEdit(student._id)} className="btn">
                        <FaUserEdit />
                      </div>
                      <div onClick={()=>handleDelete(student._id)} className="btn">
                        <MdDeleteSweep />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Age: {student.studentAge} Years
                  </p>

                  {/* Skills Section */}
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

              {/* Course & Department Details Info */}
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

              {/* Bottom Address & Fee info */}
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
  );
}
