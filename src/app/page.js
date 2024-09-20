"use client"; // Needed for using hooks

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [modalType, setModalType] = useState("category"); // State to track modal type
  const [inputValue, setInputValue] = useState(""); // State for input field
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [categories, setCategories] = useState([]); // State to store categories
  const [animals, setAnimals] = useState([]); // State to store animals

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data); // Update categories state
      } else {
        console.error("Failed to fetch categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch animals from the backend
  const fetchAnimals = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/animals");
      if (response.ok) {
        const data = await response.json();
        setAnimals(data); // Update animals state
      } else {
        console.error("Failed to fetch animals:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
    fetchAnimals(); // Fetch animals when the component mounts
  }, []);

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

  // Function to close modal
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

  // Save function for both category and animal
  const handleSave = async () => {
    if (modalType === "category") {
      try {
        const response = await fetch("http://localhost:5000/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: inputValue }), // Send input as JSON
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Category Saved:", data);
          toast.success("Category added successfully!"); // Show success toast
        } else {
          console.error("Failed to save category:", response.statusText);
          toast.error("Failed to add category.");
        }
      } catch (error) {
        console.error("Error saving category:", error);
        toast.error("Error saving category.");
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
          toast.success("Animal added successfully!");
        } else {
          console.error("Failed to save animal:", response.statusText);
          toast.error("Failed to add animal.");
        }
      } catch (error) {
        console.error("Error saving animal:", error);
        toast.error("Error saving animal.");
      }
    }

    setInputValue(""); // Clear input field
    setImageFile(null); // Clear image file
  };

  return (
    <div className="flex flex-col items-center p-5 container mx-auto">
      <div className="flex justify-between w-full mb-5">
        {/* Dynamically generated category buttons */}
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category._id}
              className="px-8 text-green-500 text-lg py-3 border-2 border-red-700 rounded-full"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Add buttons */}
        <div className="space-x-6">
          <button onClick={openAnimalModal} className="text-white text-xl border-2 px-7 py-3 rounded-full">
            Add Animal
          </button>
          <button onClick={openCategoryModal} className="text-white text-xl border-2 px-7 py-3 rounded-full">
            Add Category
          </button>
        </div>
      </div>

      {/* Display Animals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-5">
        {animals.map((animal) => (
          <div key={animal._id} className="text-center">
            {animal.image && (
              <img
                src={`http://localhost:5000/${animal.image}`}
                alt={animal.name}
                className="w-full h-60 object-cover mb-2"
              />
            )}
            <h3 className="text-xl text-white font-semibold mt-2">{animal.name}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div id="modalOverlay" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
          >
            <h2 className="text-2xl mb-6">{modalType === "category" ? "Add Category" : "Add Animal"}</h2>

            <div className="mb-6">
              <input
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

            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
