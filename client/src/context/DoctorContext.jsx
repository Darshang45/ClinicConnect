import { createContext, useContext, useState } from "react";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {

  // -------------------------
  // Doctor Data
  // -------------------------

  const [doctors, setDoctors] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // -------------------------
  // Loading
  // -------------------------

  const [loading, setLoading] = useState(false);

  // -------------------------
  // Search
  // -------------------------

  const [search, setSearch] = useState("");

  // -------------------------
  // Filters
  // -------------------------

  const [department, setDepartment] = useState("");

  const [status, setStatus] = useState("");

  // -------------------------
  // Pagination
  // -------------------------

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalDoctors, setTotalDoctors] = useState(0);

  // -------------------------
  // Drawer
  // -------------------------

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // -------------------------
  // Registration Modal
  // -------------------------

  const [isFormOpen, setFormOpen] = useState(false);

  // -------------------------
  // Delete Modal
  // -------------------------

  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // -------------------------
  // Edit Mode
  // -------------------------

  const [isEditMode, setEditMode] = useState(false);

  return (

    <DoctorContext.Provider
      value={{

        doctors,
        setDoctors,

        selectedDoctor,
        setSelectedDoctor,

        loading,
        setLoading,

        search,
        setSearch,

        department,
        setDepartment,

        status,
        setStatus,

        page,
        setPage,

        totalPages,
        setTotalPages,

        totalDoctors,
        setTotalDoctors,

        isDrawerOpen,
        setDrawerOpen,

        isFormOpen,
        setFormOpen,

        isDeleteOpen,
        setDeleteOpen,

        isEditMode,
        setEditMode,

      }}
    >

      {children}

    </DoctorContext.Provider>

  );

};

export const useDoctorContext = () => {

  return useContext(DoctorContext);

};