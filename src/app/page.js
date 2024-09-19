"use client"; // Needed for using hooks

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalType, setModalType] = useState("category"); // State to track modal type
  const [inputValue, setInputValue] = useState(""); // State for input field
  const [imageFile, setImageFile] = useState(null); // State for image file

  // Function to open modal for adding a category
  const openCategoryModal = () => {
    setModalType("category");
    setIsModalOpen(true);
  };

  // Function to open modal for adding an animal
  const openAnimalModal = () => {
    setModalType("animal");
    setIsModalOpen(true);
  };

  // Function to close modal when clicking outside
  const closeModal = (e) => {
    if (e.target.id === "modalOverlay") {
      setIsModalOpen(false);
      setInputValue(""); // Clear input value on close
      setImageFile(null); // Clear image file on close
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("click", closeModal);
    } else {
      document.removeEventListener("click", closeModal);
    }

    return () => document.removeEventListener("click", closeModal); // Cleanup
  }, [isModalOpen]);

  const handleSave = async () => {
    if (modalType === "category") {
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }), // Send the input value as JSON
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Category Saved:", data);
          toast.success("Category added successfully!"); // Show success toast
        } else {
          console.error("Failed to save category:", response.statusText);
          toast.error("Failed to add category."); // Show error toast
        }
      } catch (error) {
        console.error("Error saving category:", error);
        toast.error("Error saving category."); // Show error toast
      }
    } else if (modalType === "animal") {
      const formData = new FormData();
      formData.append("name", inputValue);
      formData.append("image", imageFile);

      try {
        const response = await fetch("http://localhost:5000/api/animals", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Animal Saved:", data);
          toast.success("Animal added successfully!"); // Show success toast
        } else {
          console.error("Failed to save animal:", response.statusText);
          toast.error("Failed to add animal."); // Show error toast
        }
      } catch (error) {
        console.error("Error saving animal:", error);
        toast.error("Error saving animal."); // Show error toast
      }
    }

    setInputValue(""); // Clear the input field
    setImageFile(null); // Clear the image file
  };

  return (
    <div className="flex justify-end p-5 container mx-auto">
      <div className="space-x-6">
        <button onClick={openAnimalModal} className="text-white text-xl border-2 px-7 py-2 rounded-full">
          Add Animal
        </button>
        <button onClick={openCategoryModal} className="text-white text-xl border-2 px-7 py-2 rounded-full">
          Add Category
        </button>
      </div>

      {isModalOpen && (
        <div id="modalOverlay" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to overlay
          >
            <h2 className="text-2xl mb-6">{modalType === "category" ? "Add Category" : "Add Animal"}</h2>

            <div className="mb-6">
              <input
                id="category"
                type="text"
                value={inputValue}
                placeholder={modalType === "category" ? "Category Name" : "Animal Name"}
                onChange={(e) => setInputValue(e.target.value)}
                className="border border-gray-300 p-3 mt-1 rounded-lg w-full"
              />
            </div>

            {modalType === "animal" && (
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="border border-gray-300 p-3 mt-1 rounded-lg w-full"
                />
              </div>
            )}

            <button
              onClick={handleSave}
              className="bg-black text-white px-8 py-2 rounded-lg w-full text-lg"
            >
              {modalType === "category" ? "Save" : "Add Animal"}
            </button>
          </div>
        </div>
      )}
      <Toaster richColors />
    </div>
  );
}
